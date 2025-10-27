import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { allTools } from "@/tools/index";
import { allPrompts } from "@/prompts/index";

const server = new McpServer({
  name: "boj-mcp",
  version: "1.0.0"
});

for (const tool of allTools) {
  server.registerTool(
    tool.name,
    {
      title: tool.title,
      description: tool.description,
      inputSchema: tool.inputSchema,
    },
    tool.handler
  );
}

for (const prompt of allPrompts) {
  server.registerPrompt(
    prompt.name,
    {
      title: prompt.title,
      description: prompt.description,
      argsSchema: prompt.argsSchema,
    },
    prompt.handler
  );
}

console.error("BOJ MCP Server is running...");
const transport = new StdioServerTransport();
await server.connect(transport);
