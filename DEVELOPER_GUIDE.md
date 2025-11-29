# BOJ-MCP Developer Guide

이 문서는 BOJ-MCP 프로젝트에 기여하거나 확장하려는 개발자를 위한 가이드입니다.

## 목차

- [프로젝트 구조](#프로젝트-구조)
- [개발 환경 설정](#개발-환경-설정)
- [아키텍처 개요](#아키텍처-개요)
- [새로운 도구 추가하기](#새로운-도구-추가하기)
- [타입 시스템](#타입-시스템)
- [API 유틸리티](#api-유틸리티)
- [코드 스타일 가이드](#코드-스타일-가이드)
- [테스트](#테스트)
- [빌드 및 배포](#빌드-및-배포)

---

## 프로젝트 구조

```
boj-mcp/
├── bin/
│   └── boj-mcp.js          # CLI 진입점 (npx 실행용)
├── dist/                    # 빌드 결과물
├── src/
│   ├── index.ts            # MCP 서버 메인 진입점
│   ├── data/
│   │   └── contest_tags.json  # 대회 태그 데이터
│   ├── tools/              # MCP 도구 정의
│   │   ├── index.ts        # 모든 도구 export
│   │   ├── search-problem.ts
│   │   ├── list-tag.ts
│   │   ├── search-tag.ts
│   │   ├── list-contest.ts
│   │   ├── search-contest.ts
│   │   ├── analyze-contest.ts
│   │   ├── recommend-contest-problems.ts
│   │   ├── user-stat.ts
│   │   ├── user-stat-tag.ts
│   │   └── user-top100.ts
│   ├── types/              # TypeScript 타입 정의
│   │   ├── problem.ts      # MCP용 문제 스키마
│   │   ├── tag.ts          # MCP용 태그 스키마
│   │   ├── solved-ac-types.ts  # solved.ac API 응답 타입
│   │   └── tool-schema.ts  # 도구 정의 헬퍼
│   └── utils/              # 유틸리티 함수
│       ├── api.ts          # API 호출 래퍼 (재시도 로직 포함)
│       └── level-to-label.ts  # 난이도 숫자 → 라벨 변환
├── test/                   # 테스트 파일
├── biome.json              # Biome 린터/포매터 설정
├── tsconfig.json           # TypeScript 설정
├── vite.config.ts          # Vite 빌드 설정
└── package.json
```

---

## 개발 환경 설정

### 요구 사항

- **Node.js**: 18.18.0 이상 또는 20.6.0 이상
- **pnpm**: 패키지 매니저 (권장)

### 설치 및 실행

```bash
# 저장소 클론
git clone https://github.com/csh1668/boj-mcp
cd boj-mcp

# 의존성 설치
pnpm install

# 개발 빌드 및 실행
pnpm start

# 빌드만 실행
pnpm build

# 린트 검사
pnpm lint

# 린트 자동 수정
pnpm lint:fix

# 테스트 실행
pnpm test

# 테스트 감시 모드
pnpm test:watch
```

### IDE 설정

프로젝트는 `@` 경로 별칭을 사용합니다. TypeScript 및 Vite 설정에서 `@/*`는 `src/*`로 매핑됩니다.

```typescript
// 예시: import 경로
import { fetchAPI } from "@/utils/api";
import { defineTool } from "@/types/tool-schema";
```

---

## 아키텍처 개요

### MCP 서버 구조

BOJ-MCP는 [Model Context Protocol (MCP)](https://modelcontextprotocol.io/)를 기반으로 합니다.

```
┌─────────────────┐     stdio      ┌─────────────────┐
│   AI Client     │ ◄────────────► │   BOJ-MCP       │
│ (Claude, etc.)  │                │   Server        │
└─────────────────┘                └────────┬────────┘
                                            │
                                            ▼
                                   ┌─────────────────┐
                                   │  solved.ac API  │
                                   └─────────────────┘
```

### 도구 등록 흐름

1. `src/index.ts`에서 MCP 서버 인스턴스 생성
2. `src/tools/index.ts`에서 모든 도구를 `allTools` 배열로 export
3. 서버가 시작되면 모든 도구를 자동 등록

```typescript
// src/index.ts
for (const tool of allTools) {
  server.registerTool(
    tool.name,
    {
      title: tool.title,
      description: tool.description,
      inputSchema: tool.inputSchema,
    },
    tool.handler
  );
}
```

---

## 새로운 도구 추가하기

### 1단계: 도구 파일 생성

`src/tools/` 디렉토리에 새 파일을 생성합니다.

```typescript
// src/tools/my-new-tool.ts
import { defineTool } from "@/types/tool-schema";
import { z } from "zod";
import { fetchAPI } from "@/utils/api";

export const myNewTool = defineTool({
  // 도구 이름 (kebab-case 권장)
  name: "my-new-tool",
  
  // 도구 제목 (UI 표시용)
  title: "My New Tool",
  
  // 도구 설명 (AI가 도구 선택 시 참고)
  description: "이 도구가 무엇을 하는지 상세히 설명합니다.",
  
  // 입력 스키마 (Zod 사용)
  inputSchema: {
    param1: z.string().describe("파라미터 1 설명"),
    param2: z.number().optional().default(10).describe("파라미터 2 설명"),
  },
  
  // 핸들러 함수
  handler: async ({ param1, param2 }) => {
    try {
      // 비즈니스 로직 구현
      const result = await someOperation(param1, param2);
      
      // 성공 응답 반환
      return {
        content: [{ type: "text", text: JSON.stringify(result) }]
      };
    } catch (error) {
      // 에러 처리
      const errorMessage = error instanceof Error 
        ? error.message 
        : '알 수 없는 오류가 발생했습니다.';
      
      return {
        content: [{ 
          type: "text", 
          text: JSON.stringify({ 
            error: true, 
            message: `오류가 발생했습니다: ${errorMessage}` 
          }) 
        }]
      };
    }
  }
});
```

### 2단계: 도구 등록

`src/tools/index.ts`에 새 도구를 추가합니다.

```typescript
// src/tools/index.ts
import { myNewTool } from "./my-new-tool";

export const allTools = [
  // ... 기존 도구들
  myNewTool,
];
```

### 3단계: 테스트

```bash
pnpm start
```

서버를 실행하고 MCP 클라이언트에서 새 도구가 표시되는지 확인합니다.

---

## 타입 시스템

### solved.ac API 타입 (`src/types/solved-ac-types.ts`)

solved.ac API 응답의 원본 구조를 정의합니다.

### MCP 타입 변환

API 응답을 MCP 클라이언트에 적합한 형태로 변환합니다.

```typescript
// src/types/problem.ts - 문제 타입 변환 예시
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
```

### 도구 스키마 정의 (`src/types/tool-schema.ts`)

`defineTool` 헬퍼 함수로 타입 안전한 도구 정의를 지원합니다.

```typescript
export type ToolConfig<InputArgs extends ToolInputShape> = {
  name: string;
  title: string;
  description: string;
  inputSchema: InputArgs;
  handler: ToolCallback<InputArgs>;
};

export function defineTool<Args extends ToolInputShape>(
  config: ToolConfig<Args>
): ToolConfig<Args> {
  return config;
}
```

---

## API 유틸리티

### fetchAPI (`src/utils/api.ts`)

재시도 로직과 타임아웃이 포함된 fetch 래퍼입니다.

```typescript
import { fetchAPI } from "@/utils/api";

// 기본 사용
const response = await fetchAPI("https://solved.ac/api/v3/...");
const data = await response.json();

// 옵션 설정
const response = await fetchAPI("https://solved.ac/api/v3/...", {
  maxRetries: 5,      // 최대 재시도 횟수 (기본: 3)
  retryDelay: 2000,   // 재시도 대기 시간 ms (기본: 1000)
  timeout: 60000,     // 타임아웃 ms (기본: 30000)
});
```

**특징:**
- Exponential backoff로 재시도
- 5xx 오류 및 429 (Rate Limit) 시 자동 재시도
- AbortController를 사용한 타임아웃 처리

### levelToLabel (`src/utils/level-to-label.ts`)

solved.ac 난이도 숫자를 읽기 쉬운 라벨로 변환합니다.

```typescript
import { levelToLabel } from "@/utils/level-to-label";

levelToLabel(0);   // "Unrated / Not Ratable"
levelToLabel(1);   // "Bronze V"
levelToLabel(6);   // "Silver V"
levelToLabel(11);  // "Gold V"
levelToLabel(16);  // "Platinum V"
levelToLabel(21);  // "Diamond V"
levelToLabel(26);  // "Ruby V"
levelToLabel(31);  // "Master"
```

---

## 코드 스타일 가이드

프로젝트는 [Biome](https://biomejs.dev/)를 사용하여 코드 스타일을 관리합니다.

### 주요 규칙

| 항목 | 규칙 |
|------|------|
| 들여쓰기 | 2 spaces |
| 줄 너비 | 100자 |
| 따옴표 | 쌍따옴표 (`"`) |
| 세미콜론 | 항상 사용 |
| 후행 쉼표 | ES5 스타일 |

### 린트 규칙

```json
{
  "linter": {
    "rules": {
      "recommended": true,
      "correctness": {
        "noUnusedVariables": "error"
      },
      "style": {
        "noParameterAssign": "error"
      },
      "suspicious": {
        "noExplicitAny": "warn"
      }
    }
  }
}
```

### 린트 실행

```bash
# 검사만 수행
pnpm lint

# 자동 수정
pnpm lint:fix
```

---

## 테스트

프로젝트는 [Vitest](https://vitest.dev/)를 사용합니다.

### 테스트 실행

```bash
# 단일 실행
pnpm test

# 감시 모드 (파일 변경 시 자동 재실행)
pnpm test:watch
```

### 테스트 작성 예시

```typescript
// test/my-tool.test.ts
import { describe, it, expect } from "vitest";
import { myNewTool } from "../src/tools/my-new-tool";

describe("myNewTool", () => {
  it("should return expected result", async () => {
    const result = await myNewTool.handler({ param1: "test", param2: 5 });
    expect(result.content[0].type).toBe("text");
    // 추가 검증...
  });
});
```

---

## 빌드 및 배포

### 빌드 설정

프로젝트는 [Vite](https://vitejs.dev/)를 빌드 도구로 사용합니다.

**주요 설정 (`vite.config.ts`):**

```typescript
export default defineConfig({
  build: {
    outDir: "dist",
    lib: {
      entry: "src/index.ts",
      formats: ["es"],
      fileName: () => "index.js",
    },
    rollupOptions: {
      external: [
        "@modelcontextprotocol/sdk",
        /@modelcontextprotocol\/sdk\/.+/,
        "zod",
        "node:path",
        "node:url",
      ],
    },
    target: "node20",
    sourcemap: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
```

### 빌드 명령어

```bash
# 빌드 실행
pnpm build

# 빌드 결과물 위치: dist/index.js
```

### NPM 배포

GitHub Actions를 통해 자동으로 NPM에 배포됩니다.

1. `package.json`의 버전 업데이트
2. 변경사항 커밋 및 푸시
3. GitHub에서 새 릴리스 생성
4. `release-to-npm.yml` 워크플로우가 자동 실행

**수동 배포:**

```bash
# 빌드 (prepack 스크립트가 자동 실행)
pnpm pack

# NPM 배포
npm publish
```

---

## 환경 변수

| 변수명 | 설명 | 기본값 |
|--------|------|--------|
| `BOJ_HANDLE` | 사용자 핸들 (solved.ac 닉네임) | - |

**설정 방법:**

CLI 인자로 전달:
```bash
npx boj-mcp --handle=your-handle
```

또는 MCP 설정에서:
```json
{
  "mcpServers": {
    "boj-mcp": {
      "command": "npx",
      "args": ["-y", "boj-mcp", "--handle=your-handle"]
    }
  }
}
```

---

## 유용한 링크

- [Model Context Protocol 공식 문서](https://modelcontextprotocol.io/)
- [MCP SDK (TypeScript)](https://github.com/modelcontextprotocol/typescript-sdk)
- [solved.ac 비공식 API 문서](https://solvedac.github.io/unofficial-documentation/)
- [Zod 문서](https://zod.dev/)
- [Biome 문서](https://biomejs.dev/)
- [Vitest 문서](https://vitest.dev/)

---

## 기여하기

1. 이슈를 먼저 확인하거나 새로운 이슈를 생성합니다.
2. 저장소를 포크합니다.
3. 기능 브랜치를 생성합니다: `git checkout -b feature/my-feature`
4. 변경사항을 커밋합니다: `git commit -m 'Add my feature'`
5. 브랜치를 푸시합니다: `git push origin feature/my-feature`
6. Pull Request를 생성합니다.

### 커밋 메시지 규칙

```
<type>: <description>

[optional body]
```

**Type:**
- `feat`: 새로운 기능
- `fix`: 버그 수정
- `docs`: 문서 변경
- `style`: 코드 스타일 변경 (기능 변경 없음)
- `refactor`: 리팩토링
- `test`: 테스트 추가/수정
- `chore`: 빌드/도구 설정 변경

---

## 라이선스

이 프로젝트는 MIT 라이선스를 따릅니다. 자세한 내용은 [LICENSE](./LICENSE) 파일을 참조하세요.

