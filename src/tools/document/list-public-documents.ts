import type { MetabaseClient } from '@src/client';
import {
  type ListPublicDocumentsInput,
  ListPublicDocumentsInputSchema,
} from '@src/schemas/document';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const listPublicDocumentsDefinition: ToolDefinition<ListPublicDocumentsInput> = {
  name: 'list_public_documents',
  description: 'List all documents with public links in Metabase',
  inputSchema: ListPublicDocumentsInputSchema,
  handler: async (client: MetabaseClient, _input: ListPublicDocumentsInput) => {
    const result = await client.get('/api/document/public');
    return formatToolResponse(result);
  },
};
