import type { MetabaseClient } from '@src/client';
import { type UpdateDocumentInput, UpdateDocumentInputSchema } from '@src/schemas/document';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const updateDocumentDefinition: ToolDefinition<UpdateDocumentInput> = {
  name: 'update_document',
  description: 'Update a document by ID in Metabase',
  inputSchema: UpdateDocumentInputSchema,
  handler: async (client: MetabaseClient, input: UpdateDocumentInput) => {
    const result = await client.put(`/api/document/${input.id}`, {
      name: input.name,
      content: input.content,
      archived: input.archived,
    });
    return formatToolResponse(result);
  },
};
