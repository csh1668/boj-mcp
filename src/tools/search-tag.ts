import { defineTool } from "@/types/tool-schema";
import z from "zod";
import { getTagList } from "./list-tag";

export const searchTagTool = defineTool({
  name: "search-tag",
  title: "Search Algorithm Tag",
  description: "태그 이름을 이용해서 태그 슬러그를 반환합니다.",
  inputSchema: {
    query: z.string().describe("태그 이름"),
  },
  handler: async ({ query }) => {
    const tagList = await getTagList();
    
    // query와 일치하는 태그들 필터링 (이름 또는 key에 query가 포함되는 경우)
    const matchedTags = tagList.items.filter((tag) =>
      tag.name.toLowerCase().includes(query.toLowerCase()) ||
      tag.key.toLowerCase().includes(query.toLowerCase()) ||
      tag.short?.toLowerCase().includes(query.toLowerCase())
    );
    
    return {
      content: [{ type: "text", text: JSON.stringify(matchedTags) }]
    };
  }
})