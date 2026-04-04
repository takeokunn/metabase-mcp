import type { MetabaseClient } from '@src/client';
import { type GetPublicDocument, GetPublicDocumentSchema } from '@src/schemas/public';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const getPublicDocumentDefinition: ToolDefinition<GetPublicDocument> = {
  name: 'get_public_document',
  description: 'Get a publicly shared document by UUID from Metabase',
  inputSchema: GetPublicDocumentSchema,
  handler: async (client: MetabaseClient, input: GetPublicDocument) => {
    const result = await client.get(`/api/public/document/${input.uuid}`);
    return formatToolResponse(result);
  },
};
