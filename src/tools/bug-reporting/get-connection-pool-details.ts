import type { MetabaseClient } from '@src/client';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const getConnectionPoolDetailsDefinition: ToolDefinition = {
  name: 'get_connection_pool_details',
  description: 'Get database connection pool details for bug reporting in Metabase',
  inputSchema: {},
  handler: async (client: MetabaseClient) => {
    const result = await client.get('/api/bug-reporting/connection-pool-details');
    return formatToolResponse(result);
  },
};
