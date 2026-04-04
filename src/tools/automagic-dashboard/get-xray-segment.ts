import type { MetabaseClient } from '@src/client';
import { type GetXraySegmentParams, GetXraySegmentParamsSchema } from '@src/schemas/automagic-dashboard';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const getXraySegmentDefinition: ToolDefinition<GetXraySegmentParams> = {
  name: 'get_xray_segment',
  description: 'Get an auto-generated X-ray dashboard for a segment in Metabase',
  inputSchema: GetXraySegmentParamsSchema,
  handler: async (client: MetabaseClient, input: GetXraySegmentParams) => {
    const result = await client.get(`/api/automagic-dashboards/segment/${input.id}`);
    return formatToolResponse(result);
  },
};
