import type { MetabaseClient } from '@src/client';
import { type CreateCollectionInput, CreateCollectionInputSchema } from '@src/schemas/collection';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for creating a new collection in Metabase
 */
export const createCollectionDefinition: ToolDefinition<CreateCollectionInput> = {
  name: 'create_collection',
  description: 'Create a new collection (folder) in Metabase',
  inputSchema: CreateCollectionInputSchema,
  handler: async (client: MetabaseClient, input: CreateCollectionInput) => {
    const result = await client.post('/api/collection', {
      name: input.name,
      description: input.description,
      parent_id: input.parent_id,
      color: input.color,
    });
    return formatToolResponse(result);
  },
};
