import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const server = new McpServer({
  name: "boj-mcp",
  version: "1.0.0"
});

server.registerTool(
  "search-problem",
  {
    title: "Search Problem",
    description: "Search for a problem on BOJ",
    inputSchema: { query: z.string().describe(`solved.ac 문제 고급 검색 쿼리 형식\n주요 연산자/필터와 예시:\n- "...": 정확히 일치 (예: "A+B - 2")\n- (): 우선순위/그룹 (예: A+B (2 | 3))\n- -, !, ~: 제외 not (예: -Large, -#greedy)\n- &: AND, |: OR (예: "A+B" 2 & #math, Small | Large)\n- *tier:: 난이도 (예: *b..s, *g4..g1, *0)\n- id:: 문제 번호 범위 (예: id:1000..1099)\n- s#solved:: 푼 사람 수 (예: s#1000.., s#100..500)\n- #tag:: 태그 (예: #dp, -#ad_hoc)\n- /from:: 출처/북마크 (예: /ucpc2022, /*favorites)\n- t#average_try:: 평균 시도 (예: t#3..5)\n- %lang:: 언어 (예: %ko)\n- @solved_by:: 유저가 푼 문제 (예: @$me, @shiftpsh)\n- o@solved_by_org:: 단체가 푼 문제 (예: o@sogang)\n- t@tried_by:: 유저가 시도한 문제 (예: t@$me)\n- v@voted_by:, c@contributed_by:: 투표/기여 (예: v@$me)\n- c/in_class:: CLASS 단계 (예: c/1)\n- e/in_class_essentials:: CLASS 에센셜 (예: e/1)\n- s?standard:: 표준 난이도 (예: s?true)\n- p?sprout:: 새싹 난이도 (예: p?true)\n- o?solvable:: 풀 수 있음 (예: o?true)\n- v?votable:, c?contributable:: 기여 가능 (예: v?true)\n- w?warning:: 문제해결 경고 (예: w?true)\n- v#voted:, c#contributed:: 기여자 수 (예: v#10.., c#1..5)\n- vote_average, vote_stdev: 고급 난이도 통계 필터\n범위 표기: a..b(이상..이하), a..(이상), ..b(이하). 공백으로 구분된 조건은 AND로 해석됩니다.`) }
  },
  async ({ query }) => {
    const params = new URLSearchParams({ query, direction: "asc", sort: "solved" });
    const response = await fetch(`https://solved.ac/api/v3/search/problem?${params.toString()}`);
    const data = await response.json();
    return {
      content: [{ type: "text", text: JSON.stringify(data) }]
    };
  }
)

const transport = new StdioServerTransport();
await server.connect(transport);
