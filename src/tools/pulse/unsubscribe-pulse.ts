import type { MetabaseClient } from '@src/client';
import { type UnsubscribePulseInput, UnsubscribePulseInputSchema } from '@src/schemas/pulse';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const unsubscribePulseDefinition: ToolDefinition<UnsubscribePulseInput> = {
  name: 'unsubscribe_pulse',
  description: 'Unsubscribe from a pulse in Metabase',
  inputSchema: UnsubscribePulseInputSchema,
  handler: async (client: MetabaseClient, input: UnsubscribePulseInput) => {
    const result = await client.delete(`/api/pulse/${input.id}/subscription`);
    return formatToolResponse(result);
  },
};
