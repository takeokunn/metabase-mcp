import type { MetabaseClient } from '@src/client';
import { type UpdatePulseInput, UpdatePulseInputSchema } from '@src/schemas/pulse';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const updatePulseDefinition: ToolDefinition<UpdatePulseInput> = {
  name: 'update_pulse',
  description: 'Update a pulse in Metabase',
  inputSchema: UpdatePulseInputSchema,
  handler: async (client: MetabaseClient, input: UpdatePulseInput) => {
    const result = await client.put(`/api/pulse/${input.id}`, {
      name: input.name,
      cards: input.cards,
      channels: input.channels,
      skip_if_empty: input.skip_if_empty,
      archived: input.archived,
    });
    return formatToolResponse(result);
  },
};
