import type { MetabaseClient } from '@src/client';
import { type GetAlertParams, GetAlertParamsSchema } from '@src/schemas/alert';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for getting a single alert by ID
 */
export const getAlertDefinition: ToolDefinition<GetAlertParams> = {
  name: 'get_alert',
  description: 'Get a single alert by ID from Metabase',
  inputSchema: GetAlertParamsSchema,
  handler: async (client: MetabaseClient, input: GetAlertParams) => {
    const alert = await client.get(`/api/alert/${input.id}`);
    return formatToolResponse(alert);
  },
};
