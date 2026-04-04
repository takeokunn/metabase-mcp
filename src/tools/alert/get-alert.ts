import type { MetabaseClient } from '@src/client';
import { type GetAlertInput, GetAlertInputSchema } from '@src/schemas/alert';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const getAlertDefinition: ToolDefinition<GetAlertInput> = {
  name: 'get_alert',
  description: 'Get details of a specific alert in Metabase',
  inputSchema: GetAlertInputSchema,
  handler: async (client: MetabaseClient, input: GetAlertInput) => {
    const result = await client.get(`/api/alert/${input.id}`);
    return formatToolResponse(result);
  },
};
