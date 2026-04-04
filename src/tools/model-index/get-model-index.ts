import type { MetabaseClient } from '@src/client';
import { type GetModelIndexParams, GetModelIndexParamsSchema } from '@src/schemas/model-index';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for getting a specific model index by ID
 */
export const getModelIndexDefinition: ToolDefinition<GetModelIndexParams> = {
  name: 'get_model_index',
  description: 'Get a specific model index by ID in Metabase',
  inputSchema: GetModelIndexParamsSchema,
  handler: async (client: MetabaseClient, input: GetModelIndexParams) => {
    const result = await client.get(`/api/model-index/${input.id}`);
    return formatToolResponse(result);
  },
};
