import type { MetabaseClient } from '@src/client';
import {
  type PreviewEmbedDashboardParams,
  PreviewEmbedDashboardParamsSchema,
} from '@src/schemas/preview-embed';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const previewEmbedDashboardDefinition: ToolDefinition<PreviewEmbedDashboardParams> = {
  name: 'preview_embed_dashboard',
  description: 'Preview an embedded dashboard by token from Metabase (admin only)',
  inputSchema: PreviewEmbedDashboardParamsSchema,
  handler: async (client: MetabaseClient, input: PreviewEmbedDashboardParams) => {
    const result = await client.get(`/api/preview_embed/dashboard/${input.token}`);
    return formatToolResponse(result);
  },
};
