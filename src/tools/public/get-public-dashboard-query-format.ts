import type { MetabaseClient } from '@src/client';
import {
  type GetPublicDashboardQueryFormatParams,
  GetPublicDashboardQueryFormatParamsSchema,
} from '@src/schemas/public';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const getPublicDashboardQueryFormatDefinition: ToolDefinition<GetPublicDashboardQueryFormatParams> =
  {
    name: 'get_public_dashboard_query_format',
    description:
      'Get query results for a dashcard in a publicly shared dashboard in a specific export format from Metabase',
    inputSchema: GetPublicDashboardQueryFormatParamsSchema,
    handler: async (client: MetabaseClient, input: GetPublicDashboardQueryFormatParams) => {
      const result = await client.get(
        `/api/public/dashboard/${input.uuid}/dashcard/${input.dashcard_id}/card/${input.card_id}/query/${input.export_format}`,
      );
      return formatToolResponse(result);
    },
  };
