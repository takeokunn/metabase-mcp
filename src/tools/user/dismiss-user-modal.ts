import type { MetabaseClient } from '@src/client';
import { type DismissUserModalInput, DismissUserModalInputSchema } from '@src/schemas/user';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const dismissUserModalDefinition: ToolDefinition<DismissUserModalInput> = {
  name: 'dismiss_user_modal',
  description: 'Dismiss a modal for a user in Metabase',
  inputSchema: DismissUserModalInputSchema,
  handler: async (client: MetabaseClient, input: DismissUserModalInput) => {
    const result = await client.put(`/api/user/${input.id}/modal/${input.modal}`, {});
    return formatToolResponse(result);
  },
};
