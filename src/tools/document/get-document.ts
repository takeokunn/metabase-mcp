import type { MetabaseClient } from '@src/client';
import { type GetDocumentInput, GetDocumentInputSchema } from '@src/schemas/document';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const getDocumentDefinition: ToolDefinition<GetDocumentInput> = {
  name: 'get_document',
  description: 'Get a document by ID in Metabase',
  inputSchema: GetDocumentInputSchema,
  handler: async (client: MetabaseClient, input: GetDocumentInput) => {
    const result = await client.get(`/api/document/${input.id}`);
    return formatToolResponse(result);
  },
};
