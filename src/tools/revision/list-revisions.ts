import type { MetabaseClient } from '@src/client';
import { type ListRevisionsParams, ListRevisionsParamsSchema } from '@src/schemas/revision';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for listing revisions in Metabase
 */
export const listRevisionsDefinition: ToolDefinition<ListRevisionsParams> = {
  name: 'list_revisions',
  description:
    'List revisions in Metabase, optionally filtered by entity type and ID',
  inputSchema: ListRevisionsParamsSchema,
  handler: async (client: MetabaseClient, input: ListRevisionsParams) => {
    const params = new URLSearchParams();
    if (input.entity !== undefined) {
      params.set('entity', input.entity);
    }
    if (input.id !== undefined) {
      params.set('id', String(input.id));
    }
    const query = params.toString();
    const url = query ? `/api/revision?${query}` : '/api/revision';
    const result = await client.get(url);
    return formatToolResponse(result);
  },
};
