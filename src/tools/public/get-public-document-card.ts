import type { MetabaseClient } from '@src/client';
import { type GetPublicDocumentCard, GetPublicDocumentCardSchema } from '@src/schemas/public';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const getPublicDocumentCardDefinition: ToolDefinition<GetPublicDocumentCard> = {
  name: 'get_public_document_card',
  description: 'Get a card from a publicly shared document by UUID in Metabase',
  inputSchema: GetPublicDocumentCardSchema,
  handler: async (client: MetabaseClient, input: GetPublicDocumentCard) => {
    const result = await client.get(`/api/public/document/${input.uuid}/card/${input.card_id}`);
    return formatToolResponse(result);
  },
};
