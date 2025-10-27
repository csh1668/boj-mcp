import { defineTool } from "@/types/tool-schema";
import contestTags from "@/data/contest_tags.json";
import { z } from "zod";

const contestTagRawSchema = z.record(z.string(), z.string());
const contestTagMcpSchema = z.object({
  count: z.number(),
  items: z.array(z.object({
    key: z.string(),
    name: z.string(),
  })),
});

type ContestTagMcp = z.infer<typeof contestTagMcpSchema>;

export async function getContestTags(): Promise<ContestTagMcp> {
  const rawData = contestTagRawSchema.parse(contestTags);
  const mcpData = contestTagMcpSchema.parse({
    count: Object.keys(rawData).length,
    items: Object.entries(rawData).map(([key, name]) => ({
      key,
      name,
    })),
  });
  return mcpData;
}

export const listContestTool = defineTool({
  name: "list-contest",
  title: "List Contest",
  description: "BOJ에 존재하는 대회 목록을 조회합니다. 주의: 2025년에 열린 충남대학교 대회가 있음에도 contest 목록에는 cnu2025가 없을 수도 있습니다. 그럴 때는 cnu와 같이 상위 대회 슬러그를 사용하여 전체 충남대학교 대회를 조회할 수 있습니다.",
  inputSchema: {},
  handler: async () => {
    const mcpData = await getContestTags();
    return {
      content: [{ type: "text", text: JSON.stringify(mcpData) }]
    };
  }
})