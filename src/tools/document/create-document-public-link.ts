import type { MetabaseClient } from '@src/client';
import { type GetDocumentPublicLinkInput, GetDocumentPublicLinkInputSchema } from '@src/schemas/document';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const createDocumentPublicLinkDefinition: ToolDefinition<GetDocumentPublicLinkInput> = {
  name: 'create_document_public_link',
  description: 'Create a public link for a document in Metabase',
  inputSchema: GetDocumentPublicLinkInputSchema,
  handler: async (client: MetabaseClient, input: GetDocumentPublicLinkInput) => {
    const result = await client.post(`/api/document/${input.id}/public-link`, {});
    return formatToolResponse(result);
  },
};
