import { createRequire } from 'node:module';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { type MetabaseClient, createMetabaseClient } from './client';
import { allTools, registerTools } from './tools';

const require = createRequire(import.meta.url);
const { version } = require('../package.json') as { version: string };

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
    version,
  });

  registerTools(server, client, allTools);

  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});
