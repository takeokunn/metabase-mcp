import type { MetabaseClient } from '@src/client';
import {
  type SearchDashboardParamValuesParams,
  SearchDashboardParamValuesParamsSchema,
} from '@src/schemas/dashboard';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for searching values for a dashboard filter parameter in Metabase
 */
export const searchDashboardParamValuesDefinition: ToolDefinition<SearchDashboardParamValuesParams> =
  {
    name: 'search_dashboard_param_values',
    description: 'Search possible values for a dashboard filter parameter in Metabase',
    inputSchema: SearchDashboardParamValuesParamsSchema,
    handler: async (client: MetabaseClient, input: SearchDashboardParamValuesParams) => {
      const result = await client.get(
        `/api/dashboard/${input.id}/params/${encodeURIComponent(input.param_key)}/search/${encodeURIComponent(input.query)}`,
      );
      return formatToolResponse(result);
    },
  };
