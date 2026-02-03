import type { MetabaseClient } from '@src/client';
import { type ListSnippetsParams, ListSnippetsParamsSchema } from '@src/schemas/snippet';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for listing all native query snippets in Metabase
 */
export const listSnippetsDefinition: ToolDefinition<ListSnippetsParams> = {
  name: 'list_snippets',
  description:
    'Get list of native query snippets in Metabase, optionally filtered by archived status',
  inputSchema: ListSnippetsParamsSchema,
  handler: async (client: MetabaseClient, input: ListSnippetsParams) => {
    const params = input.archived !== undefined ? { archived: input.archived } : undefined;
    const snippets = await client.get('/api/native-query-snippet', params);
    return formatToolResponse(snippets);
  },
};
