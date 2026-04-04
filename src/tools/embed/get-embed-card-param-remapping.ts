import type { MetabaseClient } from '@src/client';
import { type GetEmbedCardParamRemapping, GetEmbedCardParamRemappingSchema } from '@src/schemas/embed';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const getEmbedCardParamRemappingDefinition: ToolDefinition<GetEmbedCardParamRemapping> = {
  name: 'get_embed_card_param_remapping',
  description: 'Get remapping for a parameter of an embedded card in Metabase',
  inputSchema: GetEmbedCardParamRemappingSchema,
  handler: async (client: MetabaseClient, input: GetEmbedCardParamRemapping) => {
    const result = await client.get(
      `/api/embed/card/${input.token}/params/${input.param_key}/remapping`,
    );
    return formatToolResponse(result);
  },
};
