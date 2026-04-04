import type { MetabaseClient } from '@src/client';
import { type CreatePulseInput, CreatePulseInputSchema } from '@src/schemas/pulse';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const createPulseDefinition: ToolDefinition<CreatePulseInput> = {
  name: 'create_pulse',
  description: 'Create a new pulse in Metabase',
  inputSchema: CreatePulseInputSchema,
  handler: async (client: MetabaseClient, input: CreatePulseInput) => {
    const result = await client.post('/api/pulse', {
      name: input.name,
      cards: input.cards,
      channels: input.channels,
      collection_id: input.collection_id,
      skip_if_empty: input.skip_if_empty,
    });
    return formatToolResponse(result);
  },
};
