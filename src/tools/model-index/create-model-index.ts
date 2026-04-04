import type { MetabaseClient } from '@src/client';
import { type CreateModelIndexInput, CreateModelIndexInputSchema } from '@src/schemas/model-index';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for creating a new model index
 */
export const createModelIndexDefinition: ToolDefinition<CreateModelIndexInput> = {
  name: 'create_model_index',
  description: 'Create a new model index in Metabase',
  inputSchema: CreateModelIndexInputSchema,
  handler: async (client: MetabaseClient, input: CreateModelIndexInput) => {
    const result = await client.post('/api/model-index', input);
    return formatToolResponse(result);
  },
};
