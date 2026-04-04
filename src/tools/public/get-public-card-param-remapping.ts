import type { MetabaseClient } from '@src/client';
import {
  type GetPublicCardParamRemapping,
  GetPublicCardParamRemappingSchema,
} from '@src/schemas/public';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const getPublicCardParamRemappingDefinition: ToolDefinition<GetPublicCardParamRemapping> = {
  name: 'get_public_card_param_remapping',
  description: 'Get remapping for a parameter of a public card in Metabase',
  inputSchema: GetPublicCardParamRemappingSchema,
  handler: async (client: MetabaseClient, input: GetPublicCardParamRemapping) => {
    const result = await client.get(
      `/api/public/card/${input.uuid}/params/${input.param_key}/remapping`,
    );
    return formatToolResponse(result);
  },
};
