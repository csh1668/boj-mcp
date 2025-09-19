## BOJ-MCP

백준에 있는 문제를 검색하는 기능을 제공하는 **비공식** MCP입니다.

BOJ-MCP지만, solved.ac의 비공식 API를 사용합니다.

한창 개발 중입니다.

### 사용 방법

#### 1) npx로 바로 실행 (권장)

`mcp.json`에 다음을 추가합니다. Cursor 또는 Claude Desktop 모두 동일하게 동작합니다.

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

이후 클라이언트에서 MCP 서버를 자동으로 실행합니다.

참고: Notion MCP Server 설정 방식과 동일한 UX를 제공합니다. [makenotion/notion-mcp-server](https://github.com/makenotion/notion-mcp-server)

#### 2) 로컬 빌드 후 실행 (대안)

Repo를 클론한 뒤:

```
pnpm i
pnpm build
node dist/index.js
```

또는 Cursor 설정에 다음처럼 추가합니다.

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