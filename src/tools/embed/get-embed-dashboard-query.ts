import type { MetabaseClient } from '@src/client';
import {
  type GetEmbedDashboardQueryParams,
  GetEmbedDashboardQueryParamsSchema,
} from '@src/schemas/embed';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const getEmbedDashboardQueryDefinition: ToolDefinition<GetEmbedDashboardQueryParams> = {
  name: 'get_embed_dashboard_query',
  description: 'Get query results for a dashcard in an embedded dashboard from Metabase',
  inputSchema: GetEmbedDashboardQueryParamsSchema,
  handler: async (client: MetabaseClient, input: GetEmbedDashboardQueryParams) => {
    const result = await client.get(
      `/api/embed/dashboard/${input.token}/dashcard/${input.dashcard_id}/card/${input.card_id}/query`,
    );
    return formatToolResponse(result);
  },
};
