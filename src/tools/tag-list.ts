import { ProblemTag, problemTagSchema } from "../types/solved-ac-types.js";
import { defineTool } from "../types/tool-schema.js";
import { z } from "zod";
import { convertToMcpTags, mcpTagSchema } from "../types/tag.js";

const rawTagListResponseSchema = z.object({
	count: z.number(),
	items: z.array(problemTagSchema),
});

const mcpTagListResponseSchema = z.object({
	count: z.number(),
	items: z.array(mcpTagSchema),
});

export const tagListTool = defineTool({
	name: "tag-list",
	title: "Algorithm Tags List",
	description: "Get the list of algorithm tags on BOJ",
	inputSchema: {},
	handler: async () => {
		const raw: ProblemTag[] = [];
		const maxTries = 20;
		let totalCount = 0;
		for (let page = 1; page <= maxTries; page++) {
			const params = new URLSearchParams({ page: page.toString() });
			const response = await fetch(`https://solved.ac/api/v3/tag/list?${params.toString()}`);
			const data = await response.json();
			const parsed = rawTagListResponseSchema.parse(data);
			raw.push(...parsed.items);
			totalCount = parsed.count;
			if (totalCount <= raw.length) {
				break;
			}
		}

		const simplified = {
			count: raw.length,
			items: convertToMcpTags(raw)
		};
		const validated = mcpTagListResponseSchema.parse(simplified);

		return {
			content: [{ type: "text", text: JSON.stringify(validated) }]
		};
	}
});