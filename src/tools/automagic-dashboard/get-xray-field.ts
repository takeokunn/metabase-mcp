import type { MetabaseClient } from '@src/client';
import { type GetXrayFieldParams, GetXrayFieldParamsSchema } from '@src/schemas/automagic-dashboard';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const getXrayFieldDefinition: ToolDefinition<GetXrayFieldParams> = {
  name: 'get_xray_field',
  description: 'Get an auto-generated X-ray dashboard for a field in Metabase',
  inputSchema: GetXrayFieldParamsSchema,
  handler: async (client: MetabaseClient, input: GetXrayFieldParams) => {
    const result = await client.get(`/api/automagic-dashboards/field/${input.id}`);
    return formatToolResponse(result);
  },
};
