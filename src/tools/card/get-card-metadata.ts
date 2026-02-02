import type { MetabaseClient } from '@src/client';
import { type GetCardMetadataParams, GetCardMetadataParamsSchema } from '@src/schemas/card';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for getting query metadata for a card (saved question)
 */
export const getCardMetadataDefinition: ToolDefinition<GetCardMetadataParams> = {
  name: 'get_card_metadata',
  description: 'Get query metadata (columns, types, etc.) for a card (saved question)',
  inputSchema: GetCardMetadataParamsSchema,
  handler: async (client: MetabaseClient, input: GetCardMetadataParams) => {
    const metadata = await client.get(`/api/card/${input.id}/query_metadata`);
    return formatToolResponse(metadata);
  },
};
