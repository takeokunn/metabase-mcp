import type { MetabaseClient } from '@src/client';
import { type RegenerateApiKeyParams, RegenerateApiKeyParamsSchema } from '@src/schemas/api-key';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for regenerating an API key in Metabase
 */
export const regenerateApiKeyDefinition: ToolDefinition<RegenerateApiKeyParams> = {
  name: 'regenerate_api_key',
  description: 'Regenerate an API key in Metabase',
  inputSchema: RegenerateApiKeyParamsSchema,
  handler: async (client: MetabaseClient, input: RegenerateApiKeyParams) => {
    const result = await client.put(`/api/api-key/${input.id}/regenerate`, {});
    return formatToolResponse(result);
  },
};
