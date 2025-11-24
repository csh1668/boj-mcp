## BOJ-MCP

[![npm version](https://img.shields.io/npm/v/boj-mcp.svg)](https://www.npmjs.com/package/boj-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Release to NPM](https://github.com/csh1668/boj-mcp/actions/workflows/release-to-npm.yml/badge.svg)](https://github.com/csh1668/boj-mcp/actions/workflows/release-to-npm.yml)

백준에 있는 문제를 검색하는 기능을 제공하는 **비공식** MCP입니다.

BOJ-MCP지만, solved.ac의 비공식 API를 사용합니다.

한창 개발 중입니다.

### 설치 방법

#### 1) npm 사용 (권장)

컴퓨터에 [`node.js`](https://nodejs.org/ko/download)가 설치되어 있어야 합니다. 

##### Claude Desktop

Windows: `%APPDATA%\Claude\claude_desktop_config.json`

MacOS: `~/Library/Application Support/Claude/claude_desktop_config.json`

해당 위치에 파일이 없으면 생성합니다.

```json
{
  "mcpServers": {
    "boj-mcp": {
      "command": "npx",
      "args": ["-y", "boj-mcp"]
    }
  }
}
```

위 내용을 추가하고 Claude Desktop을 종료 후 다시 시작합니다.

<img width="427" height="446" alt="image" src="https://github.com/user-attachments/assets/e6cd0273-52fe-42a9-93a4-40917c48598b" />

정상적으로 설치가 되었다면 위와 같이 표시됩니다.


##### Claude Code
```bash
claude mcp add boj-mcp -- npx -y boj-mcp
```

##### Codex
```bash
codex mcp add boj-mcp -- npx -y boj-mcp
```

##### Gemini Cli
```bash
gemini mcp add boj-mcp npx -y boj-mcp
```

##### Cursor

`Ctrl + Shift + P`를 누르고 `Open MCP Settings`를 찾아 들어갑니다.
`New MCP Server`를 클릭하고 다음 내용을 붙여넣습니다.

```json
{
  "mcpServers": {
    "boj-mcp": {
      "command": "npx",
      "args": ["-y", "boj-mcp"]
    }
  }
}
```

#### 2) 로컬 빌드 후 실행

```bash
git clone https://github.com/csh1668/boj-mcp
cd boj-mcp
pnpm i
pnpm start
```

그리고 Cursor 설정에 다음처럼 추가합니다.

```json
{
  "mcpServers": {
    "boj-mcp": {
      "command": "node",
      "args": ["dist/index.js"]
    }
  }
}
```

### 사용 방법

설치가 완료되면 AI에게 다음과 같이 질문하여 백준 문제를 검색하거나 추천받을 수 있습니다.

#### 1. 문제 검색
- "골드 5 난이도의 DP 문제 찾아줘"
- "다익스트라 문제 중 푼 사람이 10명 이하인 문제 찾아줘"

#### 2. 문제 추천
- "코딩 테스트 준비를 위해 실버 난이도의 구현 문제 5개 추천해줘"
- "ICPC 예선 대비를 위한 문제 세트 추천해줘"

#### 3. 대회 및 태그 정보
- "UCPC 2023 대회의 출제 경향을 분석해줘"
- "비트마스킹 태그가 붙은 문제들은 어떤 게 있어?"

