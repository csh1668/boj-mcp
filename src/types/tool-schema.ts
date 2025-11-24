import type { ZodRawShape } from "zod";
import type { ToolCallback } from "@modelcontextprotocol/sdk/server/mcp.js";

export type ToolInputShape = ZodRawShape;

export type ToolConfig<InputArgs extends ToolInputShape> = {
  name: string;
  title: string;
  description: string;
  inputSchema: InputArgs;
  handler: ToolCallback<InputArgs>;
};

export type AnyToolConfig = ToolConfig<ToolInputShape>;

export function defineTool<Args extends ToolInputShape>(config: ToolConfig<Args>): ToolConfig<Args> {
  return config;
}