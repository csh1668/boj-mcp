import { definePrompt } from "@/types/prompt-schema";
import { z } from "zod";

export const analyzeContestPrompt = definePrompt({
  name: "analyze-contest",
  title: "Analyze Contest Trend",
  description: "특정 대회(들)의 출제 경향을 분석합니다. 문제 난이도 분포, 자주 출제되는 알고리즘 태그, 대회 준비를 위한 학습 방향을 제시합니다.",
  argsSchema: {
    contestSlugs: z.string().describe("분석할 대회 슬러그(들). 쉼표로 구분하여 여러 대회를 비교 분석할 수 있습니다. (예: 'ucpc2022' 또는 'ucpc2022,ucpc2023')"),
    compareYears: z.boolean().optional().describe("true로 설정하면 연도별 출제 경향 변화를 비교 분석합니다. (기본값: false)"),
  },
  handler: async ({ contestSlugs, compareYears }) => {
    const slugs = contestSlugs.split(',').map((s: string) => s.trim());
    const compareText = compareYears && slugs.length > 1 
      ? "각 대회의 연도별 출제 경향 변화를 비교 분석하세요." 
      : "";

    const promptText = `
다음 BOJ 대회의 출제 경향을 분석해주세요:

**대회 슬러그**: ${slugs.join(', ')}
${compareText}

1. **문제 검색**
   - 'search-problem' 도구를 사용하여 각 대회의 문제를 검색하세요.
   - 검색 쿼리 형식: "/{대회슬러그}"
   - 각 대회별로 모든 문제를 조회하세요.

2. **태그 분포 분석**
   - 각 대회에서 출제된 문제들의 알고리즘 태그를 집계하세요.
   - 태그별 출제 빈도수와 비율을 계산하세요.
   - 자주 출제된 상위 10개 알고리즘을 파악하세요.

3. **난이도 경향 분석**
   - 문제들의 난이도(levelLabel) 분포를 분석하세요.
   - 가장 많이 출제된 난이도 범위를 파악하세요.
   - 태그별 평균 난이도를 계산하세요.

4. **대회 간 비교** (여러 대회인 경우)
   - 대회별 태그 분포의 차이점을 분석하세요.
   - 난이도 경향의 변화를 파악하세요.
   - 공통적으로 출제되는 알고리즘과 특정 대회에만 나타나는 알고리즘을 구분하세요.

5. **학습 방향 제시**
   - 해당 대회 유형 준비를 위해 집중해야 할 알고리즘을 추천하세요.
   - 난이도별 학습 계획을 제안하세요.
   - 유사한 문제를 연습할 수 있는 검색 쿼리를 제공하세요.

**출력 형식**:
- 대회별 문제 수와 난이도 분포 요약
- 주요 알고리즘 태그 순위 (빈도수, 비율, 평균 난이도 포함)
- 대회 준비를 위한 구체적인 학습 로드맵
- 추천 연습 문제 검색 쿼리

분석 결과는 표나 목록 형태로 보기 쉽게 정리해주세요.
`;

    return {
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: promptText.trim(),
          }
        }
      ]
    };
  }
});

