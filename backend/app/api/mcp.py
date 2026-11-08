from fastapi import APIRouter, Depends, HTTPException
from typing import List, Dict, Any
from app.schemas.all_schemas import MCPToolDefinition, MCPExecuteRequest, MCPExecuteResponse
from app.mcp_server.tools import MCP_TOOL_REGISTRY, MCPExecutor
from app.security.auth import get_current_user
from app.models.all_models import User

router = APIRouter(prefix="/mcp", tags=["Model Context Protocol (MCP)"])

@router.get("/tools", response_model=List[MCPToolDefinition])
def list_mcp_tools():
    return MCP_TOOL_REGISTRY

@router.post("/execute", response_model=MCPExecuteResponse)
async def execute_mcp_tool(
    payload: MCPExecuteRequest,
    current_user: User = Depends(get_current_user)
):
    result = await MCPExecutor.execute_tool(
        tool_name=payload.tool_name,
        arguments=payload.arguments
    )
    return result
