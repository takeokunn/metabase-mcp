import type { MetabaseClient } from '@src/client';
import { type ListDocumentsInput, ListDocumentsInputSchema } from '@src/schemas/document';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const listDocumentsDefinition: ToolDefinition<ListDocumentsInput> = {
  name: 'list_documents',
  description: 'List all documents in Metabase',
  inputSchema: ListDocumentsInputSchema,
  handler: async (client: MetabaseClient, _input: ListDocumentsInput) => {
    const result = await client.get('/api/document');
    return formatToolResponse(result);
  },
};
