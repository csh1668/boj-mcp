import { ProblemTag, problemTagSchema } from "@/types/solved-ac-types";
import { convertToMcpTag, mcpTagSchema } from "@/types/tag";
import { defineTool } from "@/types/tool-schema";
import { fetchAPI } from "@/utils/api";
import { z } from "zod";

const rawUserStatTagResponseSchema = z.object({
  count: z.number(),
  items: z.array(z.object({
    tag: problemTagSchema,
    total: z.number(),
    solved: z.number(),
    partial: z.number(),
    tried: z.number(),
  }))
});

const mcpUserStatTagResponseSchema = z.object({
  count: z.number(),
  items: z.array(z.object({
    tag: mcpTagSchema,
    total: z.number(),
    solved: z.number(),
  }))
});

export const userStatTagTool = defineTool({
  name: "user-stat-tag",
  title: "User Stat Tag",
  description: "사용자가 푼 문제 수를 알고리즘 태그 별로 조회합니다.",
  inputSchema: {
    handle: z.string().describe("사용자 핸들 (기본적으로 환경 변수 BOJ_HANDLE로 제공되므로 입력이 필요하지 않음)"),
  },
  handler: async ({ handle }) => {
    const userHandle = handle || process.env.BOJ_HANDLE;
    if (!userHandle) {
      return {
        content: [{ type: "text", text: "사용자 핸들을 입력해주세요." }]
      };
    }

    const response = await fetchAPI(`https://solved.ac/api/v3
/user/problem_tag_stats?handle=${userHandle}`);
    const data = await response.json();
    const parsed = rawUserStatTagResponseSchema.parse(data);
    const simplified = {
      count: parsed.count,
      items: parsed.items.map((item) => {
        return {
          tag: convertToMcpTag(item.tag),
          total: item.total,
          solved: item.solved,
        }
      })
    };
    const validated = mcpUserStatTagResponseSchema.parse(simplified);
    return {
      content: [{ type: "text", text: JSON.stringify(validated) }]
    };
  }
})