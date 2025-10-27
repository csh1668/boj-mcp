import { ZodRawShape } from "zod";
import { PromptCallback } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

export type PromptArgsShape = ZodRawShape;

type InferZodShape<T extends PromptArgsShape> = {
  [K in keyof T]: T[K] extends z.ZodType<infer U> ? U : never;
};

export type PromptConfig<InputArgs extends PromptArgsShape> = {
  name: string;
  title: string;
  description: string;
  argsSchema: InputArgs;
  handler: (args: InferZodShape<InputArgs>) => ReturnType<PromptCallback<InputArgs>>;
};

export type AnyPromptConfig = PromptConfig<PromptArgsShape> & {
  handler: PromptCallback<PromptArgsShape>;
};

export function definePrompt<InputArgs extends PromptArgsShape>(
  config: PromptConfig<InputArgs>
): AnyPromptConfig {
  return {
    ...config,
    handler: (extra: any) => {
      const args = (extra.arguments || extra) as InferZodShape<InputArgs>;
      return config.handler(args);
    }
  } as AnyPromptConfig;
}