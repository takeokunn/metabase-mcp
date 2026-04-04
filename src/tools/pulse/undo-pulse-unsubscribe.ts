import type { MetabaseClient } from '@src/client';
import {
  type UndoPulseUnsubscribeInput,
  UndoPulseUnsubscribeInputSchema,
} from '@src/schemas/pulse';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const undoPulseUnsubscribeDefinition: ToolDefinition<UndoPulseUnsubscribeInput> = {
  name: 'undo_pulse_unsubscribe',
  description: 'Undo an email unsubscribe from a pulse in Metabase',
  inputSchema: UndoPulseUnsubscribeInputSchema,
  handler: async (client: MetabaseClient, input: UndoPulseUnsubscribeInput) => {
    const result = await client.post('/api/pulse/unsubscribe/undo', {
      hash: input.hash,
      email: input.email,
      pulse_id: input.pulse_id,
    });
    return formatToolResponse(result);
  },
};
