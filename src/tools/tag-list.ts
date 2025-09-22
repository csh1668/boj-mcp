import { ProblemTag, problemTagSchema } from "@/types/solved-ac-types";
import { defineTool } from "@/types/tool-schema";
import { z } from "zod";
import { convertToMcpTags, mcpTagSchema } from "@/types/tag";

const rawTagListResponseSchema = z.object({
	count: z.number(),
	items: z.array(problemTagSchema),
});

const mcpTagListResponseSchema = z.object({
	count: z.number(),
	items: z.array(mcpTagSchema),
});

type McpTagList = z.infer<typeof mcpTagListResponseSchema>;

// In-memory cache for tag list
const TAG_LIST_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours
let cachedTagList: McpTagList | null = null;
let cacheExpiresAt = 0;
let inFlightFetch: Promise<McpTagList> | null = null;

export const tagListTool = defineTool({
	name: "tag-list",
	title: "Algorithm Tags List",
	description: "BOJ의 알고리즘 태그 목록을 조회합니다.",
	inputSchema: {},
	handler: async () => {
		const now = Date.now();
		if (cachedTagList && now < cacheExpiresAt) {
			return {
				content: [{ type: "text", text: JSON.stringify(cachedTagList) }]
			};
		}

		if (!inFlightFetch) {
			inFlightFetch = (async () => {
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
				cachedTagList = validated;
				cacheExpiresAt = Date.now() + TAG_LIST_TTL_MS;
				return validated;
			})().finally(() => {
				inFlightFetch = null;
			});
		}

		const validated = await inFlightFetch;
		return {
			content: [{ type: "text", text: JSON.stringify(validated) }]
		};
	}
});