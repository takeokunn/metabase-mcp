import type { MetabaseClient } from '@src/client';
import {
  type GetDashboardFieldValuesParams,
  GetDashboardFieldValuesParamsSchema,
} from '@src/schemas/dashboard';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for getting possible values for a field used in a dashboard in Metabase
 */
export const getDashboardFieldValuesDefinition: ToolDefinition<GetDashboardFieldValuesParams> = {
  name: 'get_dashboard_field_values',
  description: 'Get possible values for a field used in a dashboard in Metabase',
  inputSchema: GetDashboardFieldValuesParamsSchema,
  handler: async (client: MetabaseClient, input: GetDashboardFieldValuesParams) => {
    const result = await client.get(
      `/api/dashboard/${input.id}/field/${input.field_id}/values`,
    );
    return formatToolResponse(result);
  },
};
