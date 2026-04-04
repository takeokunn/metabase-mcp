import type { MetabaseClient } from '@src/client';
import { type CreateDocumentInput, CreateDocumentInputSchema } from '@src/schemas/document';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const createDocumentDefinition: ToolDefinition<CreateDocumentInput> = {
  name: 'create_document',
  description: 'Create a new document in Metabase',
  inputSchema: CreateDocumentInputSchema,
  handler: async (client: MetabaseClient, input: CreateDocumentInput) => {
    const result = await client.post('/api/document', { name: input.name, content: input.content, collection_id: input.collection_id });
    return formatToolResponse(result);
  },
};
