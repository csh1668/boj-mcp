import { z } from "zod";
import { ProblemTag } from "./solved-ac-types.js";

// MCP에 반환할 간소화된 태그 스키마/타입
export const mcpTagSchema = z.object({
	key: z.string(),
	name: z.string(),
	short: z.string().optional(),
	isMeta: z.boolean(),
	bojTagId: z.number(),
	problemCount: z.number(),
});
export type McpTag = z.infer<typeof mcpTagSchema>;

// 단일 태그 변환기: solved.ac ProblemTag -> MCP Tag
export function convertToMcpTag(tag: ProblemTag): McpTag {
	const ko = tag.displayNames.find(d => d.language === "ko");
	return {
		key: tag.key,
		name: ko?.name ?? tag.key,
		short: ko?.short,
		isMeta: tag.isMeta,
		bojTagId: tag.bojTagId,
		problemCount: tag.problemCount,
	};
}

export function convertToMcpTags(tags: ProblemTag[]): McpTag[] {
	return tags.map(convertToMcpTag);
}
