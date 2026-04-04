import type { MetabaseClient } from '@src/client';
import {
  type UnsubscribePulseEmailInput,
  UnsubscribePulseEmailInputSchema,
} from '@src/schemas/pulse';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const unsubscribePulseEmailDefinition: ToolDefinition<UnsubscribePulseEmailInput> = {
  name: 'unsubscribe_pulse_email',
  description: 'Unsubscribe from pulse email notifications in Metabase',
  inputSchema: UnsubscribePulseEmailInputSchema,
  handler: async (client: MetabaseClient, input: UnsubscribePulseEmailInput) => {
    const result = await client.post('/api/pulse/unsubscribe', {
      hash: input.hash,
      email: input.email,
      pulse_id: input.pulse_id,
    });
    return formatToolResponse(result);
  },
};
