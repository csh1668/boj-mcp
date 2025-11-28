import { problemSchema } from "@/types/solved-ac-types";
import { defineTool } from "@/types/tool-schema";
import { z } from "zod";
import { convertToMcpProblems, mcpProblemSchema } from "@/types/problem";
import { fetchAPI } from "@/utils/api";

const rawSearchProblemResponseSchema = z.object({
  count: z.number(),
  items: z.array(problemSchema),
});

const mcpSearchProblemResponseSchema = z.object({
  count: z.number(),
  items: z.array(mcpProblemSchema),
});

export const searchProblemTool = defineTool({
  name: "search-problem",
  title: "Search Problem",
  description: "BOJ 문제를 검색합니다. 알고리즘 태그(#태그)를 사용한 검색 전에는 반드시 'search-tag'나 'list-tag' 도구로 유효한 태그 슬러그/이름을 확인하세요.",
  inputSchema: {
    query: z.string().describe(
      `solved.ac 문제 고급 검색 쿼리 형식\n주요 연산자/필터와 예시:\n- "...": 정확히 일치 (예: "A+B - 2")\n- (): 우선순위/그룹 (예: A+B (2 | 3))\n- -: 제외 not (예: -Large, -#greedy)\n- &: AND, |: OR (예: "A+B" 2 & #math, Small | Large)\n- *: 난이도 (예: *b..s, *g4..g1, *0)\n- id: 문제 번호 범위 (예: id:1000..1099)\n- s#: 푼 사람 수 (예: s#1000.., s#100..500)\n- #: 태그 (예: #dp, -#ad_hoc)\n- /: 출처/북마크 (예: /ucpc2022)\n- t#: 평균 시도 (예: t#3..5)\n- %: 언어 (예: %ko)\n- @: 유저가 푼 문제 (예: @shiftpsh)- c/: CLASS 단계 (예: c/1)\n- e/: CLASS 에센셜 (예: e/1)\n- s?: 표준 난이도 (예: s?true)\n- p?: 새싹 난이도 (예: p?true)\n- o?: 풀 수 있음 (예: o?true)\n- v?:, c?: 기여 가능 (예: v?true)\n- w?: 문제해결 경고 (예: w?true)\n- v#:, c#: 기여자 수 (예: v#10.., c#1..5)\n범위 표기: a..b(이상..이하), a..(이상), ..b(이하). 공백으로 구분된 조건은 AND로 해석됨`
    ),
    sort: z.enum(["id", "level", "title", "solved", "average_try", "random"]).optional().default("solved").describe("정렬 기준"),
    direction: z.enum(["asc", "desc"]).optional().default("asc").describe("정렬 방향"),
    include_tags: z.boolean().optional().default(true).describe("태그 정보를 포함할지 여부 (알고리즘 태그 정보는 힌트가 될 수 있으므로, 사용자가 학습을 원한다면 false로 설정하세요)"),
    // excludeUserSolved: z.boolean().optional().default(false).describe("사용자가 푼 문제를 제외할지 여부 (기본값: false)"),
    userSolved: z.enum(["all", "solved", "not_solved"]).optional().default("all").describe("사용자가 푼 문제를 어떻게 할지: all: 상관없음, solved: 사용자가 푼 문제만 조회, not_solved: 사용자가 풀지 않은 문제만 조회")
  },
  handler: async ({ query, sort, direction, include_tags, userSolved }) => {
    try {
      const userHandle = process.env.BOJ_HANDLE;

      if (userSolved && userHandle) {
        switch (userSolved) {
          case "solved":
            query += ` @${userHandle}`; break;
          case "not_solved":
            query += ` -@${userHandle}`; break;
          default:
            break;
        }
      }

      const params = new URLSearchParams({ query, direction, sort });
      const response = await fetchAPI(`https://solved.ac/api/v3/search/problem?${params.toString()}`);
      const data = await response.json();
      const parsed = rawSearchProblemResponseSchema.parse(data);

    const simplified = {
      count: parsed.count,
      items: convertToMcpProblems(parsed.items),
    };

    if (!include_tags) {
      simplified.items = simplified.items.map((item) => {
        return {
          ...item,
          tags: [],
        };
      });
    }

      const validated = mcpSearchProblemResponseSchema.parse(simplified);

      return {
        content: [{ type: "text", text: JSON.stringify(validated) }]
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
            message: `문제 검색 중 오류가 발생했습니다: ${errorMessage}` 
          }) 
        }]
      };
    }
  }
});
