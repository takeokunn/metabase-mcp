import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { MetabaseClient } from './client.js';
import { getDatabases } from './tools/get-databases.js';

async function main() {
  let client: MetabaseClient;

  try {
    client = new MetabaseClient();
  } catch (error) {
    console.error('Failed to initialize Metabase client:', error);
    process.exit(1);
  }

  const server = new McpServer({
    name: 'metabase-mcp',
    version: '0.1.0',
  });

  server.tool('get_databases', 'Get list of databases configured in Metabase', {}, async () => {
    try {
      return await getDatabases(client);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return {
        content: [
          {
            type: 'text',
            text: `Error fetching databases: ${message}`,
          },
        ],
        isError: true,
      };
    }
  });

  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});
