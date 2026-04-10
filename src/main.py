from langchain.agents import create_agent
from langchain.agents.middleware import HumanInTheLoopMiddleware
from langchain_openai import ChatOpenAI
from langchain.tools import tool
from langgraph.types import Command
from src.prompts.brain import BRAIN_PROMPT
from src.prompts.playbook import PLAYBOOK_PROMPT
from src.tools.execute_playbook import execute_playbook
import os


brain = ChatOpenAI(
    model="nvidia/nemotron-3-super-120b-a12b:free",
    api_key=os.environ["OPENROUTER_API_KEY"],
    base_url="https://openrouter.ai/api/v1",
    streaming=True,
)

playbook_model = ChatOpenAI(
    model="minimax/minimax-m2.5:free",
    api_key=os.environ["OPENROUTER_API_KEY"],
    base_url="https://openrouter.ai/api/v1",
    streaming=True,
)

playbook_agent = create_agent(
    playbook_model,
    system_prompt=PLAYBOOK_PROMPT,
)

@tool("playbook", description="Ansible playbook authoring agent. Call this tool when the user asks to write, generate, create, or modify an Ansible playbook, role, task block, handler, Jinja2 template, or variable file. Returns deployable YAML.")
def call_playbook_agent(query: str):
    full_response = ""
    for chunks in playbook_agent.stream(
        {"messages": [{"role": "user", "content": query}]},
        stream_mode=["messages"],
        version="v2"
    ):
        if chunks["type"] == "messages":
            token, metadata = chunks["data"]
            if token.content:
                full_response += token.content
    return full_response

agent = create_agent(
    brain,
    tools=[call_playbook_agent, execute_playbook],
    system_prompt=BRAIN_PROMPT,
    middleware=[HumanInTheLoopMiddleware(
        interrupt_on={
            "execute_playbook" : {"allowed_decisions": ["approve", "reject"]}
        },
        description_prefix="Tool execution pending approval"
    )],
)

