import type { MetabaseClient } from '@src/client';
import { type DeleteApiKeyParams, DeleteApiKeyParamsSchema } from '@src/schemas/api-key';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for deleting an API key in Metabase
 */
export const deleteApiKeyDefinition: ToolDefinition<DeleteApiKeyParams> = {
  name: 'delete_api_key',
  description: 'Delete an API key from Metabase',
  inputSchema: DeleteApiKeyParamsSchema,
  handler: async (client: MetabaseClient, input: DeleteApiKeyParams) => {
    const result = await client.delete(`/api/api-key/${input.id}`);
    return formatToolResponse(result);
  },
};
