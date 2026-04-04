import type { MetabaseClient } from '@src/client';
import {
  type GetXrayModelIndexInput,
  GetXrayModelIndexInputSchema,
} from '@src/schemas/automagic-dashboard';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const getXrayModelIndexDefinition: ToolDefinition<GetXrayModelIndexInput> = {
  name: 'get_xray_model_index',
  description: 'Get an x-ray automagic dashboard for a model index by primary key in Metabase',
  inputSchema: GetXrayModelIndexInputSchema,
  handler: async (client: MetabaseClient, input: GetXrayModelIndexInput) => {
    const result = await client.get(
      `/api/automagic-dashboards/model_index/${input.model_index_id}/primary_key/${input.pk_id}`,
    );
    return formatToolResponse(result);
  },
};
