import type { MetabaseClient } from '@src/client';
import { type GetEmbedCardParamValues, GetEmbedCardParamValuesSchema } from '@src/schemas/embed';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const getEmbedCardParamValuesDefinition: ToolDefinition<GetEmbedCardParamValues> = {
  name: 'get_embed_card_param_values',
  description: 'Get values for a parameter of an embedded card in Metabase',
  inputSchema: GetEmbedCardParamValuesSchema,
  handler: async (client: MetabaseClient, input: GetEmbedCardParamValues) => {
    const result = await client.get(
      `/api/embed/card/${input.token}/params/${input.param_key}/values`,
    );
    return formatToolResponse(result);
  },
};
