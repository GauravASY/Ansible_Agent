# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

**Environment Setup:**
- Python 3.12+ required
- Dependencies managed via pyproject.toml
- Virtual environment already configured at `.venv`
- Activate with: `source .venv/bin/activate`

**Running the Application:**
- Main entry point: `src/main.py`
- Run with: `python src/main.py`
- Requires OPENROUTER_API_KEY environment variable (see .env)

**Testing:**
- No test framework currently configured
- Manual testing via direct execution of the agent

**Code Quality:**
- No linting/formatting tools configured
- Follow existing code style in the repository

## Code Architecture

**High-Level Structure:**
```
src/
├── main.py              # Main agent orchestration (Brain agent)
├── prompts/
│   ├── brain.py         # Brain agent system prompt & delegation logic
│   └── playbook.py      # Playbook agent system prompt
└── tools/
    └── execute_playbook.py # Ansible playbook execution tool
```

**Core Components:**

1. **Brain Agent** (`src/main.py` + `src/prompts/brain.py`):
   - Central orchestrator using LangChain's create_agent
   - Delegates requests based on content analysis:
     - Playbook generation requests → Playbook-agent
     - Playbook execution requests → execute_playbook tool
     - General infrastructure questions → Direct response
   - Uses HumanInTheLoopMiddleware for approval interrupts on execute_playbook

2. **Playbook Agent** (`src/prompts/playbook.py`):
   - Specialized agent for generating Ansible YAML content
   - Called via `call_playbook_agent` tool when playbook authoring is needed
   - Returns deployable YAML only (no execution)

3. **Execution Tool** (`src/tools/execute_playbook.py`):
   - Safely executes Ansible playbooks with multiple safeguards:
     - Writes playbook to temporary file
     - Requires user approval via interrupt() before execution
     - Defaults to dry-run mode (--check --diff) unless explicitly overridden
     - Supports inventory specification, tags, extra vars, working directory
     - Cleans up temporary files after execution
     - Returns formatted output with success/failure status

**Workflow Patterns:**

- **Playbook Generation Only**: User asks to "write/create/generate" a playbook → Brain delegates to Playbook-agent → Returns YAML
- **Playbook Execution**: User asks to "run/apply/deploy" a playbook → Brain delegates to execute_playbook → Approval prompt → Execution
- **Combined Workflow**: User wants both generation and execution → Brain first calls Playbook-agent for YAML, then execute_playbook with that output
- **Direct Response**: Conceptual questions, troubleshooting, non-Ansible topics → Brain responds directly without tool delegation

**Key Constraints Enforced:**
- Brain agent never generates Ansible YAML itself - always delegates to Playbook-agent
- execute_playbook tool handles its own approval - Brain never asks for confirmation separately
- Dry-run is default unless user explicitly requests live execution
- All temporary files are cleaned up post-execution

## Important Files

- `src/main.py` - Entry point, agent initialization
- `src/prompts/brain.py` - Delegation logic and agent behavior guidelines
- `src/prompts/playbook.py` - Playbook generation agent instructions
- `src/tools/execute_playbook.py` - Safe Ansible execution implementation
- `.env` - Environment variables (OPENROUTER_API_KEY required)
- `pyproject.toml` - Project dependencies (langchain, langchain-openai, langgraph-cli)