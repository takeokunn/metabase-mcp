import type { MetabaseClient } from '@src/client';
import { type CreateAlertInput, CreateAlertInputSchema } from '@src/schemas/alert';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for creating a new alert in Metabase
 */
export const createAlertDefinition: ToolDefinition<CreateAlertInput> = {
  name: 'create_alert',
  description: 'Create a new alert for a card (saved question) in Metabase',
  inputSchema: CreateAlertInputSchema,
  handler: async (client: MetabaseClient, input: CreateAlertInput) => {
    const result = await client.post('/api/alert', {
      card: input.card,
      alert_condition: input.alert_condition,
      alert_first_only: input.alert_first_only,
      alert_above_goal: input.alert_above_goal,
      channels: input.channels ?? [],
    });
    return formatToolResponse(result);
  },
};
