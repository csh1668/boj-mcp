## BOJ-MCP

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
