import type { MetabaseClient } from '@src/client';
import {
  type SearchDashboardFieldValuesParams,
  SearchDashboardFieldValuesParamsSchema,
} from '@src/schemas/dashboard';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for searching values for a field used in a dashboard in Metabase
 */
export const searchDashboardFieldValuesDefinition: ToolDefinition<SearchDashboardFieldValuesParams> =
  {
    name: 'search_dashboard_field_values',
    description: 'Search values for a field used in a dashboard in Metabase',
    inputSchema: SearchDashboardFieldValuesParamsSchema,
    handler: async (client: MetabaseClient, input: SearchDashboardFieldValuesParams) => {
      const result = await client.get(
        `/api/dashboard/${input.id}/field/${input.field_id}/search/${encodeURIComponent(input.search_value)}`,
      );
      return formatToolResponse(result);
    },
  };
