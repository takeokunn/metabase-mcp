import type { MetabaseClient } from '@src/client';
import { type ListAlertsInput, ListAlertsInputSchema } from '@src/schemas/alert';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const listAlertsDefinition: ToolDefinition<ListAlertsInput> = {
  name: 'list_alerts',
  description: 'List all alerts in Metabase',
  inputSchema: ListAlertsInputSchema,
  handler: async (client: MetabaseClient, _input: ListAlertsInput) => {
    const result = await client.get('/api/alert');
    return formatToolResponse(result);
  },
};
