import { searchProblemTool } from "@/tools/search-problem";
import { listTagTool } from "@/tools/list-tag";
import { searchTagTool } from "./search-tag";
import { listContestTool } from "./list-contest";
import { searchContestTool } from "./search-contest";

export const allTools = [
  searchProblemTool,
  listTagTool,
  searchTagTool,
  listContestTool,
  searchContestTool,
];