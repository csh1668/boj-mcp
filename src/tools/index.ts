import { searchProblemTool } from "@/tools/search-problem";
import { listTagTool } from "@/tools/list-tag";
import { searchTagTool } from "./search-tag";
import { listContestTool } from "./list-contest";
import { searchContestTool } from "./search-contest";
import { analyzeContestTool } from "./analyze-contest";
import { recommendContestProblemsTool } from "./recommend-contest-problems";
import { userTop100Tool } from "./user-top100";
import { userStatTool } from "./user-stat";
import { userStatTagTool } from "./user-stat-tag";

export const allTools = [
  searchProblemTool,
  listTagTool,
  searchTagTool,
  listContestTool,
  searchContestTool,
  analyzeContestTool,
  recommendContestProblemsTool,
  userTop100Tool,
  userStatTool,
  userStatTagTool,
];