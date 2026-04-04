import type { MetabaseClient } from '@src/client';
import { type CopyDocumentInput, CopyDocumentInputSchema } from '@src/schemas/document';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const copyDocumentDefinition: ToolDefinition<CopyDocumentInput> = {
  name: 'copy_document',
  description: 'Copy a document by ID in Metabase',
  inputSchema: CopyDocumentInputSchema,
  handler: async (client: MetabaseClient, input: CopyDocumentInput) => {
    const result = await client.post(`/api/document/${input.id}/copy`, {});
    return formatToolResponse(result);
  },
};
