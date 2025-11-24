import { z } from "zod";
import type { Problem as SolvedAcProblem } from "@/types/solved-ac-types";
import { levelToLabel } from "@/utils/level-to-label";

// MCP에 반환할 간소화된 문제 스키마/타입
export const mcpProblemSchema = z.object({
	id: z.number(),
	title: z.string(),
	level: z.number(),
	levelLabel: z.string(),
	accepted: z.number(),
	averageTries: z.number(),
	tags: z.array(z.string()),
	url: z.string()
});
export type McpProblem = z.infer<typeof mcpProblemSchema>;

export function convertToMcpProblem(problem: SolvedAcProblem): McpProblem {
	return {
		id: problem.problemId,
		title: problem.titleKo,
		level: problem.level,
		levelLabel: levelToLabel(problem.level),
		accepted: problem.acceptedUserCount,
		averageTries: problem.averageTries,
		tags: problem.tags.map(t => {
			const koName = t.displayNames.find(d => d.language === "ko");
			return (koName?.name ?? t.key);
		}),
		url: `https://www.acmicpc.net/problem/${problem.problemId}`
	};
}

export function convertToMcpProblems(problems: SolvedAcProblem[]): McpProblem[] {
	return problems.map(convertToMcpProblem);
}