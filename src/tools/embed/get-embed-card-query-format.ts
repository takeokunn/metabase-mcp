import type { MetabaseClient } from '@src/client';
import {
  type GetEmbedCardQueryFormatParams,
  GetEmbedCardQueryFormatParamsSchema,
} from '@src/schemas/embed';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const getEmbedCardQueryFormatDefinition: ToolDefinition<GetEmbedCardQueryFormatParams> = {
  name: 'get_embed_card_query_format',
  description: 'Get query results for an embedded card in a specific export format from Metabase',
  inputSchema: GetEmbedCardQueryFormatParamsSchema,
  handler: async (client: MetabaseClient, input: GetEmbedCardQueryFormatParams) => {
    const result = await client.get(
      `/api/embed/card/${input.token}/query/${input.export_format}`,
    );
    return formatToolResponse(result);
  },
};
