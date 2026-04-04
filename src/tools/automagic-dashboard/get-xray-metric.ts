import type { MetabaseClient } from '@src/client';
import { type GetXrayMetricParams, GetXrayMetricParamsSchema } from '@src/schemas/automagic-dashboard';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const getXrayMetricDefinition: ToolDefinition<GetXrayMetricParams> = {
  name: 'get_xray_metric',
  description: 'Get an auto-generated X-ray dashboard for a metric in Metabase',
  inputSchema: GetXrayMetricParamsSchema,
  handler: async (client: MetabaseClient, input: GetXrayMetricParams) => {
    const result = await client.get(`/api/automagic-dashboards/metric/${input.id}`);
    return formatToolResponse(result);
  },
};
