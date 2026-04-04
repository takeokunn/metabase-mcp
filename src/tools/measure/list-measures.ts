import type { MetabaseClient } from '@src/client';
import { type ListMeasuresInput, ListMeasuresInputSchema } from '@src/schemas/measure';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const listMeasuresDefinition: ToolDefinition<ListMeasuresInput> = {
  name: 'list_measures',
  description: 'List all measures in Metabase',
  inputSchema: ListMeasuresInputSchema,
  handler: async (client: MetabaseClient, _input: ListMeasuresInput) => {
    const result = await client.get('/api/measure');
    return formatToolResponse(result);
  },
};
