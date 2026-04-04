import type { MetabaseClient } from '@src/client';
import { type DeleteDocumentInput, DeleteDocumentInputSchema } from '@src/schemas/document';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const deleteDocumentDefinition: ToolDefinition<DeleteDocumentInput> = {
  name: 'delete_document',
  description: 'Delete a document by ID in Metabase',
  inputSchema: DeleteDocumentInputSchema,
  handler: async (client: MetabaseClient, input: DeleteDocumentInput) => {
    const result = await client.delete(`/api/document/${input.id}`);
    return formatToolResponse(result);
  },
};
