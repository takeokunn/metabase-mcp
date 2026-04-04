import type { MetabaseClient } from '@src/client';
import {
  type GetPublicDashboardQueryParams,
  GetPublicDashboardQueryParamsSchema,
} from '@src/schemas/public';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const getPublicDashboardQueryDefinition: ToolDefinition<GetPublicDashboardQueryParams> = {
  name: 'get_public_dashboard_query',
  description: 'Get query results for a dashcard in a publicly shared dashboard from Metabase',
  inputSchema: GetPublicDashboardQueryParamsSchema,
  handler: async (client: MetabaseClient, input: GetPublicDashboardQueryParams) => {
    const result = await client.get(
      `/api/public/dashboard/${input.uuid}/dashcard/${input.dashcard_id}/card/${input.card_id}/query`,
    );
    return formatToolResponse(result);
  },
};
