import type { MetabaseClient } from '@src/client';
import { type UpdateApiKeyInput, UpdateApiKeyInputSchema } from '@src/schemas/api-key';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for updating an API key in Metabase
 */
export const updateApiKeyDefinition: ToolDefinition<UpdateApiKeyInput> = {
  name: 'update_api_key',
  description: 'Update an existing API key in Metabase',
  inputSchema: UpdateApiKeyInputSchema,
  handler: async (client: MetabaseClient, input: UpdateApiKeyInput) => {
    const { id, ...updateData } = input;
    const result = await client.put(`/api/api-key/${id}`, updateData);
    return formatToolResponse(result);
  },
};
