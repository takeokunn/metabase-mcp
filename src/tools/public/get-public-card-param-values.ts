import type { MetabaseClient } from '@src/client';
import { type GetPublicCardParamValues, GetPublicCardParamValuesSchema } from '@src/schemas/public';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const getPublicCardParamValuesDefinition: ToolDefinition<GetPublicCardParamValues> = {
  name: 'get_public_card_param_values',
  description: 'Get values for a parameter of a public card in Metabase',
  inputSchema: GetPublicCardParamValuesSchema,
  handler: async (client: MetabaseClient, input: GetPublicCardParamValues) => {
    const result = await client.get(
      `/api/public/card/${input.uuid}/params/${input.param_key}/values`,
    );
    return formatToolResponse(result);
  },
};
