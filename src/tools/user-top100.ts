import { problemSchema } from "@/types/solved-ac-types";
import { convertToMcpProblems, mcpProblemSchema } from "@/types/problem";
import { defineTool } from "@/types/tool-schema";
import { fetchAPI } from "@/utils/api";
import { z } from "zod";

const rawUserTop100ResponseSchema = z.object({
  count: z.number(),
  items: z.array(problemSchema),
});

const mcpUserTop100ResponseSchema = z.object({
  count: z.number(),
  items: z.array(mcpProblemSchema),
});

export const userTop100Tool = defineTool({
  name: "user-top100-problems",
  title: "User Top 100 Problems",
  description: "사용자가 푼 문제 중 문제 수준이 높은 상위 100 문제를 가져옵니다",
  inputSchema: {
    handle: z.string().optional().describe("사용자 핸들 (기본적으로 환경 변수 BOJ_HANDLE로 제공되므로 입력이 필요하지 않음)"),
  },
  handler: async ({ handle }) => {
    const userHandle = handle || process.env.BOJ_HANDLE;
    if (!userHandle) {
      return {
        content: [{ type: "text", text: "사용자 핸들을 입력해주세요." }]
      }
    }

    const response = await fetchAPI(`https://solved.ac/api/v3/user/top_100?handle=${userHandle}`);
    const data = await response.json();
    const parsed = rawUserTop100ResponseSchema.parse(data);
    const simplified = {
      count: parsed.count,
      items: convertToMcpProblems(parsed.items),
    };
    const validated = mcpUserTop100ResponseSchema.parse(simplified);
    return {
      content: [{ type: "text", text: JSON.stringify(validated) }]
    };
  }
})