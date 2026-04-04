import type { MetabaseClient } from '@src/client';
import { type GetEmbedDashboardParams, GetEmbedDashboardParamsSchema } from '@src/schemas/embed';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const getEmbedDashboardDefinition: ToolDefinition<GetEmbedDashboardParams> = {
  name: 'get_embed_dashboard',
  description: 'Get an embedded dashboard by JWT token from Metabase',
  inputSchema: GetEmbedDashboardParamsSchema,
  handler: async (client: MetabaseClient, input: GetEmbedDashboardParams) => {
    const result = await client.get(`/api/embed/dashboard/${input.token}`);
    return formatToolResponse(result);
  },
};
