import type { MetabaseClient } from '@src/client';
import {
  type GetPublicCardQueryFormatParams,
  GetPublicCardQueryFormatParamsSchema,
} from '@src/schemas/public';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const getPublicCardQueryFormatDefinition: ToolDefinition<GetPublicCardQueryFormatParams> = {
  name: 'get_public_card_query_format',
  description:
    'Get query results for a publicly shared card in a specific export format from Metabase',
  inputSchema: GetPublicCardQueryFormatParamsSchema,
  handler: async (client: MetabaseClient, input: GetPublicCardQueryFormatParams) => {
    const result = await client.get(
      `/api/public/card/${input.uuid}/query/${input.export_format}`,
    );
    return formatToolResponse(result);
  },
};
