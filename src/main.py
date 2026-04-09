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
)

playbook_model = ChatOpenAI(
    model="minimax/minimax-m2.5:free",
    api_key=os.environ["OPENROUTER_API_KEY"],
    base_url="https://openrouter.ai/api/v1",
)

playbook_agent = create_agent(
    playbook_model,
    system_prompt=PLAYBOOK_PROMPT,
)

@tool("playbook", description="Ansible playbook authoring agent. Call this tool when the user asks to write, generate, create, or modify an Ansible playbook, role, task block, handler, Jinja2 template, or variable file. Returns deployable YAML.")
def call_playbook_agent(query: str):
    result = playbook_agent.invoke({"messages": [{"role": "user", "content": query}]})
    return result["messages"][-1].content

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

for chunk in agent.stream(
    input,
    stream_mode=["updates", "messages"],
    version="v2"
):
    if chunk["type"] == "messages":
        token, metadata = chunk["data"]
        if token.content:
            print(token.content, end="", flush=True)
    elif chunk["type"] == "updates":
        if "__interrupt__" in chunk["data"]:
            print(f"\n\nInterrupt: {chunk['data']['__interrupt__']}")

for chunk in agent.stream(
    input,
    Command(resume={"decisions": [{"type": "approve"}]}),
    stream_mode=["updates", "messages"],
    version="v2",
):
    if chunk["type"] == "messages":
        token, metadata = chunk["data"]
        if token.content:
            print(token.content, end="", flush=True)