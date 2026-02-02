import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { type MetabaseClient, createMetabaseClient } from './client';
import { allTools, registerTools } from './tools';

async function main() {
  let client: MetabaseClient;

  try {
    client = createMetabaseClient();
  } catch (error) {
    console.error('Failed to initialize Metabase client:', error);
    process.exit(1);
  }

  const server = new McpServer({
    name: 'metabase-mcp',
    version: '0.1.0',
  });

  registerTools(server, client, allTools);

  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});
