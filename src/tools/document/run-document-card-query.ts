import type { MetabaseClient } from '@src/client';
import { type RunDocumentCardQueryInput, RunDocumentCardQueryInputSchema } from '@src/schemas/document';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const runDocumentCardQueryDefinition: ToolDefinition<RunDocumentCardQueryInput> = {
  name: 'run_document_card_query',
  description: 'Run a card query within a document in Metabase',
  inputSchema: RunDocumentCardQueryInputSchema,
  handler: async (client: MetabaseClient, input: RunDocumentCardQueryInput) => {
    const result = await client.post(`/api/document/${input.id}/card/${input.card_id}/query`, {});
    return formatToolResponse(result);
  },
};
