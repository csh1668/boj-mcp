import { defineTool } from "@/types/tool-schema";
import { z } from "zod";

export const analyzeContestTool = defineTool({
  name: "analyze-contest",
  title: "Analyze Contest Trend",
  description: "특정 대회(들)의 출제 경향을 분석하는 방법을 안내합니다. 문제 난이도 분포, 자주 출제되는 알고리즘 태그, 대회 준비를 위한 학습 방향을 제시하는 가이드를 제공합니다.",
  inputSchema: {
    contestSlugs: z.string().describe("분석할 대회 슬러그(들). 쉼표로 구분하여 여러 대회를 비교 분석할 수 있습니다. (예: 'ucpc2022' 또는 'ucpc2022,ucpc2023')"),
    compareYears: z.boolean().optional().default(false).describe("true로 설정하면 연도별 출제 경향 변화를 비교 분석합니다. (기본값: false)"),
  },
  handler: async ({ contestSlugs, compareYears }) => {
    const slugs = contestSlugs.split(',').map((s: string) => s.trim());
    const compareText = compareYears && slugs.length > 1 
      ? "각 대회의 연도별 출제 경향 변화를 비교 분석하세요." 
      : "";
    const currentYear = new Date().getFullYear();

    const guideText = `
# BOJ 대회 출제 경향 분석 가이드

**현재 연도**: ${currentYear}년  
**분석 대상 대회**: ${slugs.join(', ')}
${compareText}

## ⚠️ 중요: 최신 대회 문제 찾는 방법

대회 태그는 연도별로 세분화되지 않은 경우가 많습니다:
- 예: \`cnu\` 태그는 \`cnu2023\`까지만 존재하며, 2024년과 2025년 대회는 상위 태그 \`cnu\`에만 포함됩니다.
- **최신 대회 찾기**: 상위 태그(예: \`cnu\`, \`ucpc\`)로 검색 후, 문제 번호 내림차순(\`sort=id&direction=desc\`)으로 정렬하세요.
- 연속된 문제 번호들이 같은 대회에서 출제된 문제입니다. (예: 32000~32010번이 연속이면 한 대회)

## 📋 분석 절차

### 1단계: 문제 검색
- \`search-problem\` 도구를 사용하여 각 대회의 문제를 검색하세요.
- 검색 쿼리 형식: \`"/{대회슬러그}"\`
- **최신 대회 확인**: \`sort=id&direction=desc\`로 정렬하여 가장 최근 문제부터 확인
- 각 대회별로 모든 문제를 조회하세요.

### 2단계: 태그 분포 분석
- 각 대회에서 출제된 문제들의 알고리즘 태그를 집계하세요.
- 태그별 출제 빈도수와 비율을 계산하세요.
- 자주 출제된 상위 10개 알고리즘을 파악하세요.

### 3단계: 난이도 경향 분석
- 문제들의 난이도(levelLabel) 분포를 분석하세요.
- 가장 많이 출제된 난이도 범위를 파악하세요.
- 태그별 평균 난이도를 계산하세요.

### 4단계: 대회 간 비교 (여러 대회인 경우)
- 대회별 태그 분포의 차이점을 분석하세요.
- 난이도 경향의 변화를 파악하세요.
- 공통적으로 출제되는 알고리즘과 특정 대회에만 나타나는 알고리즘을 구분하세요.

### 5단계: 학습 방향 제시
- 해당 대회 유형 준비를 위해 집중해야 할 알고리즘을 추천하세요.
- 난이도별 학습 계획을 제안하세요.
- 유사한 문제를 연습할 수 있는 검색 쿼리를 제공하세요.

## 📊 출력 형식

분석 결과는 다음 내용을 포함하여 보기 쉽게 정리해주세요:

1. **대회별 문제 수와 난이도 분포 요약**
   - 각 난이도별 문제 개수
   - 난이도 분포 그래프 (텍스트 형태)

2. **주요 알고리즘 태그 순위**
   - 태그 이름
   - 출제 빈도수 및 비율
   - 태그별 평균 난이도

3. **대회 준비를 위한 학습 로드맵**
   - 우선순위가 높은 알고리즘
   - 단계별 학습 순서

4. **추천 연습 문제 검색 쿼리**
   - \`search-problem\` 도구에서 사용할 수 있는 쿼리 예시
   - 각 문제의 URL을 포함하여 사용자가 직접 문제 지문을 확인할 수 있도록 제공

**참고**: 문제 지문(본문)은 제공되지 않습니다. 각 문제의 URL을 클릭하여 백준 사이트에서 직접 확인하시거나, 문제 지문을 복사해 주시면 더 자세한 도움을 드릴 수 있습니다.
`.trim();

    return {
      content: [{ type: "text", text: guideText }]
    };
  }
});

