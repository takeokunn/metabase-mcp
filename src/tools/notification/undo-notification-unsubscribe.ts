import type { MetabaseClient } from '@src/client';
import { type UndoUnsubscribeInput, UndoUnsubscribeInputSchema } from '@src/schemas/notification';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const undoNotificationUnsubscribeDefinition: ToolDefinition<UndoUnsubscribeInput> = {
  name: 'undo_notification_unsubscribe',
  description: 'Undo a global unsubscribe for an email in Metabase',
  inputSchema: UndoUnsubscribeInputSchema,
  handler: async (client: MetabaseClient, input: UndoUnsubscribeInput) => {
    const result = await client.post('/api/notification/unsubscribe/undo', {
      email: input.email,
      hash: input.hash,
    });
    return formatToolResponse(result);
  },
};
