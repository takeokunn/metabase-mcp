import type { MetabaseClient } from '@src/client';
import { type GetXrayTableParams, GetXrayTableParamsSchema } from '@src/schemas/automagic-dashboard';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const getXrayTableDefinition: ToolDefinition<GetXrayTableParams> = {
  name: 'get_xray_table',
  description: 'Get an auto-generated X-ray dashboard for a table in Metabase',
  inputSchema: GetXrayTableParamsSchema,
  handler: async (client: MetabaseClient, input: GetXrayTableParams) => {
    const result = await client.get(`/api/automagic-dashboards/table/${input.id}`);
    return formatToolResponse(result);
  },
};
