import type { MetabaseClient } from '@src/client';
import { type CreateCardInput, CreateCardInputSchema } from '@src/schemas/card';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for creating a new card (saved question) in Metabase
 */
export const createCardDefinition: ToolDefinition<CreateCardInput> = {
  name: 'create_card',
  description: 'Create a new card (saved question) in Metabase',
  inputSchema: CreateCardInputSchema,
  handler: async (client: MetabaseClient, input: CreateCardInput) => {
    const result = await client.post('/api/card', {
      name: input.name,
      display: input.display,
      dataset_query: input.dataset_query,
      visualization_settings: input.visualization_settings ?? {},
      collection_id: input.collection_id,
    });
    return formatToolResponse(result);
  },
};
