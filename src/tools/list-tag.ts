import { ProblemTag, problemTagSchema } from "@/types/solved-ac-types";
import { defineTool } from "@/types/tool-schema";
import { z } from "zod";
import { convertToMcpTags, mcpTagSchema } from "@/types/tag";
import { fetchAPI } from "@/utils/api";

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

export async function getTagList(): Promise<McpTagList> {
	const now = Date.now();
	if (cachedTagList && now < cacheExpiresAt) {
		return cachedTagList;
	}

	if (!inFlightFetch) {
		inFlightFetch = (async () => {
			const raw: ProblemTag[] = [];
			const maxTries = 20;
			let totalCount = 0;
			for (let page = 1; page <= maxTries; page++) {
				try {
					const params = new URLSearchParams({ page: page.toString() });
					const response = await fetchAPI(`https://solved.ac/api/v3/tag/list?${params.toString()}`);
					const data = await response.json();
					const parsed = rawTagListResponseSchema.parse(data);
					raw.push(...parsed.items);
					totalCount = parsed.count;
					if (totalCount <= raw.length) {
						break;
					}
				} catch (error) {
					// 첫 페이지에서 실패하면 전체 실패로 처리
					if (page === 1) {
						throw error;
					}
					// 중간 페이지에서 실패하면 지금까지 수집한 데이터로 반환
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

	return await inFlightFetch;
}

export const listTagTool = defineTool({
	name: "list-tag",
	title: "Algorithm Tags List",
	description: "BOJ의 알고리즘 태그 목록을 조회합니다.",
	inputSchema: {},
	handler: async () => {
		try {
			const tagList = await getTagList();
			return {
				content: [{ type: "text", text: JSON.stringify(tagList) }]
			};
		} catch (error) {
			const errorMessage = error instanceof Error 
				? error.message 
				: '알 수 없는 오류가 발생했습니다.';
			
			return {
				content: [{ 
					type: "text", 
					text: JSON.stringify({ 
						error: true, 
						message: `태그 목록 조회 중 오류가 발생했습니다: ${errorMessage}` 
					}) 
				}]
			};
		}
	}
});