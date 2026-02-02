import type { MetabaseClient } from '@src/client';
import { type SendInviteInput, SendInviteInputSchema } from '@src/schemas/user';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for sending an invite email to a user
 */
export const sendInviteDefinition: ToolDefinition<SendInviteInput> = {
  name: 'send_invite',
  description: 'Send an invite email to a user in Metabase',
  inputSchema: SendInviteInputSchema,
  handler: async (client: MetabaseClient, input: SendInviteInput) => {
    const result = await client.post(`/api/user/${input.id}/send_invite`);
    return formatToolResponse(result);
  },
};
