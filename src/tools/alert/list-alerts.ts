import type { MetabaseClient } from '@src/client';
import { type ListAlertsParams, ListAlertsParamsSchema } from '@src/schemas/alert';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for listing all alerts in Metabase
 */
export const listAlertsDefinition: ToolDefinition<ListAlertsParams> = {
  name: 'list_alerts',
  description: 'Get list of alerts in Metabase, optionally filtered by card ID',
  inputSchema: ListAlertsParamsSchema,
  handler: async (client: MetabaseClient, input: ListAlertsParams) => {
    const alerts = input.card_id
      ? await client.get(`/api/alert/question/${input.card_id}`)
      : await client.get('/api/alert');
    return formatToolResponse(alerts);
  },
};
