import type { MetabaseClient } from '@src/client';
import { type GetSnippetParams, GetSnippetParamsSchema } from '@src/schemas/snippet';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for getting a single native query snippet by ID
 */
export const getSnippetDefinition: ToolDefinition<GetSnippetParams> = {
  name: 'get_snippet',
  description: 'Get a single native query snippet by ID from Metabase',
  inputSchema: GetSnippetParamsSchema,
  handler: async (client: MetabaseClient, input: GetSnippetParams) => {
    const snippet = await client.get(`/api/native-query-snippet/${input.id}`);
    return formatToolResponse(snippet);
  },
};
