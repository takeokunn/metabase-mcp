import type { MetabaseClient } from '@src/client';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const cancelCloudMigrationDefinition: ToolDefinition = {
  name: 'cancel_cloud_migration',
  description: 'Cancel an in-progress cloud migration in Metabase',
  inputSchema: {},
  handler: async (client: MetabaseClient) => {
    const result = await client.put('/api/cloud-migration/cancel');
    return formatToolResponse(result);
  },
};
