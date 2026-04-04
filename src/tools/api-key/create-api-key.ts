import type { MetabaseClient } from '@src/client';
import { type CreateApiKeyInput, CreateApiKeyInputSchema } from '@src/schemas/api-key';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for creating an API key in Metabase
 */
export const createApiKeyDefinition: ToolDefinition<CreateApiKeyInput> = {
  name: 'create_api_key',
  description: 'Create a new API key in Metabase',
  inputSchema: CreateApiKeyInputSchema,
  handler: async (client: MetabaseClient, input: CreateApiKeyInput) => {
    const result = await client.post('/api/api-key', input);
    return formatToolResponse(result);
  },
};
