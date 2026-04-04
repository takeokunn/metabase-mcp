import type { MetabaseClient } from '@src/client';
import {
  type GetXrayEntityInput,
  GetXrayEntityInputSchema,
} from '@src/schemas/automagic-dashboard';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const getXrayEntityDefinition: ToolDefinition<GetXrayEntityInput> = {
  name: 'get_xray_entity',
  description: 'Get an x-ray automagic dashboard for any entity in Metabase',
  inputSchema: GetXrayEntityInputSchema,
  handler: async (client: MetabaseClient, input: GetXrayEntityInput) => {
    const result = await client.get(`/api/automagic-dashboards/${input.entity}/${input.entity_id}`);
    return formatToolResponse(result);
  },
};
