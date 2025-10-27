import { defineTool } from "@/types/tool-schema";
import { getContestTags } from "./list-contest";
import { z } from "zod";

export const searchContestTool = defineTool({
  name: "search-contest",
  title: "Search Contest",
  description: "대회 이름을 이용해서 대회 슬러그를 반환합니다.",
  inputSchema: {
    query: z.string().describe("대회 이름"),
  },
  handler: async ({ query }) => {
    const contestTags = await getContestTags();
    const lowerQuery = query.toLowerCase();
    
    const matchedContests = contestTags.items.filter((contest) =>
      contest.name.toLowerCase().includes(lowerQuery) ||
      contest.key.toLowerCase().includes(lowerQuery)
    );
    
    const result = {
      count: matchedContests.length,
      items: matchedContests
    };
    
    return {
      content: [{ type: "text", text: JSON.stringify(result) }]
    };
  }
})