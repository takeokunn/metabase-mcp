import type { MetabaseClient } from '@src/client';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for listing all metrics in Metabase
 */
export const listMetricsDefinition: ToolDefinition = {
  name: 'list_metrics',
  description: 'List all metrics in Metabase',
  inputSchema: {},
  handler: async (client: MetabaseClient) => {
    const result = await client.get('/api/metric');
    return formatToolResponse(result);
  },
};
