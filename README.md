## BOJ-MCP

백준에 있는 문제를 검색하는 기능을 제공하는 **비공식** MCP입니다.

BOJ-MCP지만, solved.ac의 비공식 API를 사용합니다.

한창 개발 중입니다.

### 설치 방법

#### 1) npm 사용 (권장)

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
