import type { MetabaseClient } from '@src/client';
import { type DeleteModelIndexParams, DeleteModelIndexParamsSchema } from '@src/schemas/model-index';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for deleting a model index
 */
export const deleteModelIndexDefinition: ToolDefinition<DeleteModelIndexParams> = {
  name: 'delete_model_index',
  description: 'Delete a model index by ID in Metabase',
  inputSchema: DeleteModelIndexParamsSchema,
  handler: async (client: MetabaseClient, input: DeleteModelIndexParams) => {
    const result = await client.delete(`/api/model-index/${input.id}`);
    return formatToolResponse(result);
  },
};
