import type { MetabaseClient } from '@src/client';
import { type GetPersistedModelParams, GetPersistedModelParamsSchema } from '@src/schemas/persist';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for getting a specific persisted model by ID
 */
export const getPersistedModelDefinition: ToolDefinition<GetPersistedModelParams> = {
  name: 'get_persisted_model',
  description: 'Get a specific persisted model by ID in Metabase',
  inputSchema: GetPersistedModelParamsSchema,
  handler: async (client: MetabaseClient, input: GetPersistedModelParams) => {
    const result = await client.get(`/api/persist/${input.id}`);
    return formatToolResponse(result);
  },
};
