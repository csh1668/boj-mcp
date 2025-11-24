import { defineTool } from "@/types/tool-schema";
import { z } from "zod";

export const recommendContestProblemsTool = defineTool({
  name: "recommend-contest-problems",
  title: "Recommend Contest Problems",
  description: "목적에 맞는 대회 문제를 추천하는 방법을 안내합니다. 학교 대회, ICPC, 특정 대회 준비 등 목적에 따라 맞춤형 문제 세트를 찾는 가이드를 제공합니다.",
  inputSchema: {
    purpose: z.enum(["school", "icpc", "specific_contest", "general"]).describe(
      "준비 목적:\n" +
      "- 'school': 학교 대회 준비\n" +
      "- 'icpc': ICPC 준비 (ICPC, IOI, BAPC, NWERC 등 국제 대회)\n" +
      "- 'specific_contest': 특정 대회 준비 (해당 대회의 과거 기출)\n" +
      "- 'general': 일반적인 실력 향상"
    ),
    targetContest: z.string().optional().describe(
      "purpose가 'specific_contest'일 때 필수. 준비하려는 대회 이름 또는 슬러그 (예: 'ucpc', '충남대학교', 'icpc')"
    ),
    currentTier: z.string().optional().describe(
      "현재 티어 또는 목표 난이도 (예: 'bronze', 'silver', 'gold', 'platinum'). 미입력 시 다양한 난이도 추천"
    ),
    focusTags: z.string().optional().describe(
      "집중하고 싶은 알고리즘 태그들 (쉼표로 구분, 예: 'dp,그리디,그래프')"
    ),
    problemCount: z.number().optional().default(10).describe("추천받을 문제 개수 (기본값: 10)")
  },
  handler: async ({ purpose, targetContest, currentTier, focusTags, problemCount = 10 }) => {
    const currentYear = new Date().getFullYear();

    let guideText = "";

    // 목적별 가이드 생성
    switch (purpose) {
      case "school":
        guideText = `
# 학교 대회 준비를 위한 문제 추천 가이드

**현재 연도**: ${currentYear}년

## ⚠️ 중요: 최신 대회 문제 찾는 방법

대회 태그는 연도별로 세분화되지 않은 경우가 많습니다:
- 예: \`cnu\` 태그는 \`cnu2023\`까지만 존재하며, 2024년과 2025년 대회는 상위 태그 \`cnu\`에만 포함됩니다.
- **최신 대회 찾기**: 상위 태그(예: \`cnu\`, \`snu\`, \`yonsei\`)로 검색 후, 문제 번호 내림차순(\`sort=id&direction=desc\`)으로 정렬하세요.
- 연속된 문제 번호들이 같은 대회에서 출제된 문제입니다. (예: 32000~32010번이 연속이면 한 대회)

다음 단계로 학교 대회 준비에 최적화된 문제를 찾아보세요:

## 1단계: 학교 대회 목록 확인
- \`search-contest\` 또는 \`list-contest\` 도구를 사용하여 주요 학교 대회를 찾으세요
- 예: 서울대학교, 연세대학교, 고려대학교, KAIST 등

## 2단계: 대회별 문제 분석
각 대회의 특징을 파악하세요:
- \`search-problem\` 도구로 \`"/{대회슬러그}"\` 형태로 검색
- **최신 대회 확인**: \`sort=id&direction=desc\`로 정렬하여 가장 최근 문제부터 확인
- 난이도 분포 확인
- 최근 3년간 기출 문제 패턴 파악
${focusTags ? `- 집중 알고리즘: ${focusTags}` : ''}

## 3단계: 문제 추천 (${problemCount}문제)
다음 기준으로 문제를 선정하세요:
${currentTier ? `- 목표 난이도: ${currentTier}` : '- 다양한 난이도 (Bronze ~ Gold)'}
- **중요**: 알고리즘 태그 정보는 표시하지 마세요 (힌트가 될 수 있음)
- 각 문제마다 다음 정보만 포함:
  * 문제 번호와 제목
  * 난이도 (정확한 난이도는 푯)
  * 어느 대회에서 출제되었는지
  * 추천 이유 (난이도나 대회 유형 기준으로만)

## 4단계: 학습 플랜
- 난이도별 풀이 순서 제안
- 각 문제별 예상 소요 시간
- 주차별 학습 계획
`;
        break;

      case "icpc":
        guideText = `
# ICPC 준비를 위한 문제 추천 가이드

**현재 연도**: ${currentYear}년

## ⚠️ 중요: 최신 대회 문제 찾는 방법

대회 태그는 연도별로 세분화되지 않은 경우가 많습니다:
- 예: \`icpc\` 태그는 세부 연도별 태그가 없을 수 있으며, 최신 대회는 상위 태그에만 포함됩니다.
- **최신 대회 찾기**: 상위 태그(예: \`icpc\`, \`ioi\`)로 검색 후, 문제 번호 내림차순(\`sort=id&direction=desc\`)으로 정렬하세요.
- 연속된 문제 번호들이 같은 대회에서 출제된 문제입니다.

국제 대회(ICPC, IOI, BAPC, NWERC 등) 준비에 최적화된 문제를 찾아보세요:

## 1단계: 국제 대회 목록 검색
- \`search-contest\` 도구로 다음 대회들을 찾으세요:
  * ICPC (Korea, Asia, World Finals)
  * IOI (International Olympiad in Informatics)
  * BAPC (Benelux Algorithm Programming Contest)
  * NWERC (Northwestern Europe Regional Contest)
  * CERC, SWERC 등

## 2단계: ICPC/IOI 스타일 문제 분석
- \`search-problem\` 도구로 각 대회의 문제 검색
- **최신 대회 확인**: \`sort=id&direction=desc\`로 정렬하여 가장 최근 문제부터 확인
- 난이도 분포 파악
- 대회별 출제 경향 분석
${focusTags ? `- 집중 알고리즘: ${focusTags}` : ''}

## 3단계: 문제 추천 (${problemCount}문제)
${currentTier ? `목표 난이도: ${currentTier}` : 'Gold ~ Platinum 난이도 중심'}
- **중요**: 알고리즘 태그 정보는 표시하지 마세요 (힌트가 될 수 있음)

각 문제마다:
- 문제 번호, 제목, 난이도
- 어떤 대회에서 출제되었는지
- 추천 이유 (대회 유형과 난이도 기준으로만)

## 4단계: 팀 연습 전략
- 3인 1팀 시뮬레이션 방법
- 역할 분담 추천
- 시간 관리 팁
`;
        break;

      case "specific_contest":
        if (!targetContest) {
          guideText = `
# 오류: targetContest 파라미터 누락

'specific_contest' 목적을 선택했지만 'targetContest' 파라미터가 제공되지 않았습니다.
'targetContest'에 준비하려는 대회 이름을 입력해주세요. 

**예시:**
- 'ucpc'
- '충남대학교'
- 'icpc korea'
`;
        } else {
          guideText = `
# ${targetContest} 대회 준비를 위한 맞춤 문제 추천 가이드

**현재 연도**: ${currentYear}년

## ⚠️ 중요: 최신 대회 문제 찾는 방법

대회 태그는 연도별로 세분화되지 않은 경우가 많습니다:
- 예: 특정 대회의 최신 연도 태그가 없을 수 있으며, 상위 태그에만 포함됩니다.
- **최신 대회 찾기**: 상위 태그로 검색 후, 문제 번호 내림차순(\`sort=id&direction=desc\`)으로 정렬하세요.
- 연속된 문제 번호들이 같은 대회에서 출제된 문제입니다.

## 1단계: 대회 정보 검색
- \`search-contest\` 도구로 "${targetContest}" 관련 대회를 찾으세요
- 과거 개최 연도별 대회 목록 확인

## 2단계: 과거 기출 분석
해당 대회의 최근 3~5년 기출 문제를 분석하세요:
- \`search-problem\` 도구로 각 연도별 문제 검색
  * 검색 쿼리: \`"/{대회슬러그}"\`
  * **최신 대회 확인**: \`sort=id&direction=desc\`로 정렬하여 가장 최근 문제부터 확인
- 출제 경향 파악:
  * 난이도 분포
  * 평균 시도 횟수 (체감 난이도)
${focusTags ? `  * 집중 알고리즘: ${focusTags}` : ''}

## 3단계: 유사 문제 추천 (${problemCount}문제)
분석 결과를 바탕으로:
${currentTier ? `- 목표 난이도: ${currentTier}` : '- 실제 대회와 유사한 난이도'}
- 과거 기출 우선 추천
- 유사한 대회의 문제도 포함
- **중요**: 알고리즘 태그 정보는 표시하지 마세요 (힌트가 될 수 있음)

각 문제마다:
- 실제 ${targetContest} 기출인지 여부
- 어느 연도 문제인지
- 난이도 및 예상 풀이 시간

## 4단계: 실전 대비 전략
- 과거 대회 모의고사 일정
- 시간제한 내 목표 문제 수
- 약점 알고리즘 보완 계획
`;
        }
        break;
      default:
        guideText = `
# 알고리즘 실력 향상을 위한 대회 문제 추천 가이드

**현재 연도**: ${currentYear}년

## ⚠️ 중요: 최신 대회 문제 찾는 방법

대회 태그는 연도별로 세분화되지 않은 경우가 많습니다:
- 예: 특정 대회의 최신 연도 태그가 없을 수 있으며, 상위 태그에만 포함됩니다.
- **최신 대회 찾기**: 상위 태그로 검색 후, 문제 번호 내림차순(\`sort=id&direction=desc\`)으로 정렬하세요.
- 연속된 문제 번호들이 같은 대회에서 출제된 문제입니다.

## 1단계: 현재 실력 분석
${currentTier ? `현재 티어: ${currentTier}` : ''}
${focusTags ? `집중 알고리즘: ${focusTags}` : ''}

## 2단계: 다양한 대회에서 문제 선정
- \`list-contest\` 도구로 전체 대회 목록 확인
- 다양한 유형의 대회에서 문제 선택:
  * 학교 대회
  * 국제 대회
  * 온라인 대회

## 3단계: 균형잡힌 문제 추천 (${problemCount}문제)
- \`search-problem\` 도구로 다양한 대회 문제 검색
${currentTier ? `- 난이도: ${currentTier} 중심으로` : '- 현재 수준 +1 난이도 도전'}
- **중요**: 알고리즘 태그 정보는 표시하지 마세요 (공부하는 사용자에게 불필요한 힌트가 될 수 있으므로 학습에 방해됨)

각 문제마다:
- 문제 번호, 제목, 난이도
- 어느 대회에서 출제되었는지
- 추천 이유 (난이도와 대회 유형 기준으로만)

## 4단계: 학습 로드맵
- 주차별 목표 문제 수
- 난이도 상승 계획
- 문제 풀이 후 복습 포인트
`;
        break;
    }

    return {
      content: [{ type: "text", text: guideText.trim() }]
    };
  }
});
