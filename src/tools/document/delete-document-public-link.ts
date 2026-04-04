import type { MetabaseClient } from '@src/client';
import { type DeleteDocumentPublicLinkInput, DeleteDocumentPublicLinkInputSchema } from '@src/schemas/document';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const deleteDocumentPublicLinkDefinition: ToolDefinition<DeleteDocumentPublicLinkInput> = {
  name: 'delete_document_public_link',
  description: 'Delete the public link for a document in Metabase',
  inputSchema: DeleteDocumentPublicLinkInputSchema,
  handler: async (client: MetabaseClient, input: DeleteDocumentPublicLinkInput) => {
    const result = await client.delete(`/api/document/${input.id}/public-link`);
    return formatToolResponse(result);
  },
};
