import type { MetabaseClient } from '@src/client';
import { type RunDocumentCardQueryInput, RunDocumentCardQueryInputSchema } from '@src/schemas/document';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const exportDocumentCardQueryDefinition: ToolDefinition<RunDocumentCardQueryInput> = {
  name: 'export_document_card_query',
  description: 'Export a card query result from a document in Metabase',
  inputSchema: RunDocumentCardQueryInputSchema,
  handler: async (client: MetabaseClient, input: RunDocumentCardQueryInput) => {
    const result = await client.post(`/api/document/${input.id}/card/${input.card_id}/query/${input.export_format}`, {});
    return formatToolResponse(result);
  },
};
