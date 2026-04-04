import type { MetabaseClient } from '@src/client';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const getCloudMigrationDefinition: ToolDefinition = {
  name: 'get_cloud_migration',
  description: 'Get the current cloud migration status in Metabase',
  inputSchema: {},
  handler: async (client: MetabaseClient) => {
    const result = await client.get('/api/cloud-migration');
    return formatToolResponse(result);
  },
};
