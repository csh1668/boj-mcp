import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { allTools } from "@/tools/index";

function parseArgs() {
  const args = process.argv.slice(2);
  for (const arg of args) {
    if (arg.startsWith("--handle=")) {
      const handle = arg.substring("--handle=".length);
      if (handle && handle !== "your-handle") {
        process.env.BOJ_HANDLE = handle;
      }
    } else if (arg === "--handle" && args[args.indexOf(arg) + 1]) {
      const handle = args[args.indexOf(arg) + 1];
      if (handle && handle !== "your-handle") {
        process.env.BOJ_HANDLE = handle;
      }
    }
  }
}

parseArgs();

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

console.error("BOJ MCP Server is running...");
const transport = new StdioServerTransport();
await server.connect(transport);
