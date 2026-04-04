import type { MetabaseClient } from '@src/client';
import { type GetXrayCardParams, GetXrayCardParamsSchema } from '@src/schemas/automagic-dashboard';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const getXrayCardDefinition: ToolDefinition<GetXrayCardParams> = {
  name: 'get_xray_card',
  description: 'Get an auto-generated X-ray dashboard for a saved question/card in Metabase',
  inputSchema: GetXrayCardParamsSchema,
  handler: async (client: MetabaseClient, input: GetXrayCardParams) => {
    const result = await client.get(`/api/automagic-dashboards/question/${input.id}`);
    return formatToolResponse(result);
  },
};
