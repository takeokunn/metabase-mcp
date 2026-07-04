import type { MetabaseClient } from '@src/client';
import { type ListMetricsInput, ListMetricsInputSchema } from '@src/schemas/metric';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for listing metrics (cards with type='metric') in Metabase
 */
export const listMetricsDefinition: ToolDefinition<ListMetricsInput> = {
  name: 'list_metrics',
  description: 'List metrics readable by the current user in Metabase',
  inputSchema: ListMetricsInputSchema,
  handler: async (client: MetabaseClient) => {
    const result = await client.get('/api/metric');
    return formatToolResponse(result);
  },
};
