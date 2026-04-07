import os
import subprocess
import tempfile
import uuid
from typing import Annotated

from langchain.tools import tool
from langgraph.types import interrupt


@tool(
    "execute_playbook",
    description=(
        "Execute an Ansible playbook on the target inventory. "
        "Call this tool when the user asks to run, apply, deploy, or execute a playbook. "
        "Always supply the full playbook YAML as `playbook_yaml`. "
        "The tool will pause and ask the user for approval before running anything."
    ),
)
def execute_playbook(
    playbook_yaml: Annotated[str, "Full YAML content of the Ansible playbook to execute"],
    inventory: Annotated[
        str,
        "Inventory host pattern or path to an inventory file (default: 'localhost,')",
    ] = "localhost,",
    dry_run: Annotated[
        bool,
        "If True, passes --check --diff flags (no changes applied). Defaults to True.",
    ] = True,
    extra_vars: Annotated[
        dict,
        "Optional extra variables passed via --extra-vars (key/value pairs).",
    ] = {},
    tags: Annotated[
        list[str],
        "Optional list of tags to pass via --tags.",
    ] = [],
    working_dir: Annotated[
        str | None,
        "Working directory for the ansible-playbook process. Useful when the playbook "
        "references relative paths (e.g. templates/, files/). Defaults to None (CWD).",
    ] = None,
) -> str:
    """
    Human-in-the-loop Ansible playbook executor.

    Writes the playbook to /tmp/<uuid>.yml, asks for user approval via LangGraph
    interrupt(), then runs ansible-playbook and returns the output.
    """

    # ── 1. Ask for user approval ──────────────────────────────────────────────
    mode_label = "DRY-RUN (--check --diff)" if dry_run else "LIVE EXECUTION"

    preview_lines = playbook_yaml.strip().splitlines()
    preview = "\n".join(preview_lines[:30])
    if len(preview_lines) > 30:
        preview += f"\n... ({len(preview_lines) - 30} more lines)"

    approval: str = interrupt(
        {
            "message": (
                f"⚠️  Playbook Execution Approval Required\n\n"
                f"Mode      : {mode_label}\n"
                f"Inventory : {inventory}\n"
                f"Working dir: {working_dir or os.getcwd()}\n"
                + (f"Tags      : {', '.join(tags)}\n" if tags else "")
                + (f"Extra vars: {extra_vars}\n" if extra_vars else "")
                + f"\n--- Playbook Preview ---\n{preview}\n"
                f"\nType 'yes' to proceed, anything else to cancel."
            )
        }
    )

    if approval.strip().lower() != "yes":
        return "❌ Execution cancelled — user did not approve."

    # ── 2. Write playbook to a temp file ──────────────────────────────────────
    tmp_path = os.path.join(tempfile.gettempdir(), f"playbook_{uuid.uuid4().hex}.yml")
    try:
        with open(tmp_path, "w") as f:
            f.write(playbook_yaml)

        # ── 3. Build ansible-playbook command ─────────────────────────────────
        cmd = ["ansible-playbook", tmp_path, "-i", inventory]

        if dry_run:
            cmd += ["--check", "--diff"]

        if tags:
            cmd += ["--tags", ",".join(tags)]

        if extra_vars:
            # Flatten dict to key=value pairs
            ev_str = " ".join(f"{k}={v}" for k, v in extra_vars.items())
            cmd += ["--extra-vars", ev_str]

        # ── 4. Run ────────────────────────────────────────────────────────────
        result = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            cwd=working_dir,
        )

        stdout = result.stdout.strip()
        stderr = result.stderr.strip()

        # Trim output to avoid flooding LLM context (keep last 100 lines)
        MAX_LINES = 100
        stdout_lines = stdout.splitlines()
        if len(stdout_lines) > MAX_LINES:
            stdout = (
                f"[... {len(stdout_lines) - MAX_LINES} lines omitted ...]\n"
                + "\n".join(stdout_lines[-MAX_LINES:])
            )

        status = "✅ SUCCESS" if result.returncode == 0 else f"❌ FAILED (exit {result.returncode})"

        output = f"{status}\n\n--- stdout ---\n{stdout}"
        if stderr:
            output += f"\n\n--- stderr ---\n{stderr}"

        return output

    finally:
        # ── 5. Clean up temp file ─────────────────────────────────────────────
        if os.path.exists(tmp_path):
            os.remove(tmp_path)
