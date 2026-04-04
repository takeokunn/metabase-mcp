import type { MetabaseClient } from '@src/client';
import {
  type GetEmbedDashboardQueryFormatParams,
  GetEmbedDashboardQueryFormatParamsSchema,
} from '@src/schemas/embed';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const getEmbedDashboardQueryFormatDefinition: ToolDefinition<GetEmbedDashboardQueryFormatParams> =
  {
    name: 'get_embed_dashboard_query_format',
    description:
      'Get query results for a dashcard in an embedded dashboard in a specific export format from Metabase',
    inputSchema: GetEmbedDashboardQueryFormatParamsSchema,
    handler: async (client: MetabaseClient, input: GetEmbedDashboardQueryFormatParams) => {
      const result = await client.get(
        `/api/embed/dashboard/${input.token}/dashcard/${input.dashcard_id}/card/${input.card_id}/query/${input.export_format}`,
      );
      return formatToolResponse(result);
    },
  };
