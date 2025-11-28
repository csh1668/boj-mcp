import { defineTool } from "@/types/tool-schema";
import { fetchAPI } from "@/utils/api";
import { levelToLabel } from "@/utils/level-to-label";
import { z } from "zod";

const rawUserStatResponseSchema = z.array(z.object({
  level: z.number(),
  total: z.number(),
  solved: z.number(),
  partial: z.number(),
  tried: z.number(),
}));

const mcpUserStatResponseSchema = z.object({
  count: z.number(),
  items: z.array(z.object({
    level: z.number(),
    levelLabel: z.string(),
    total: z.number(),
    solved: z.number(),
  }))
});

export const userStatTool = defineTool({
  name: "user-stat",
  title: "User Stat",
  description: "사용자가 푼 문제 수를 문제 난이도 별로 조회합니다.",
  inputSchema: {
    handle: z.string().optional().describe("사용자 핸들 (기본적으로 환경 변수 BOJ_HANDLE로 제공되므로 입력이 필요하지 않음)"),
  },
  handler: async ({ handle }) => {
    const userHandle = handle || process.env.BOJ_HANDLE;
    if (!userHandle) {
      return {
        content: [{ type: "text", text: "사용자 핸들을 입력해주세요." }]
      };
    }

    const response = await fetchAPI(`https://solved.ac/api/v3/user/problem_stats?handle=${userHandle}`);
    const data = await response.json();
    const parsed = rawUserStatResponseSchema.parse(data);
    const simplified = {
      count: parsed.length,
      items: parsed.map((item) => {
        return {
          level: item.level,
          levelLabel: levelToLabel(item.level),
          total: item.total,
          solved: item.solved,
        }
      })
    };
    const validated = mcpUserStatResponseSchema.parse(simplified);
    return {
      content: [{ type: "text", text: JSON.stringify(validated) }]
    };
  }
});