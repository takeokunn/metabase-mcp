import type { MetabaseClient } from '@src/client';
import {
  type GetCardParamValuesParams,
  GetCardParamValuesParamsSchema,
} from '@src/schemas/card';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for getting possible values for a card filter parameter in Metabase
 */
export const getCardParamValuesDefinition: ToolDefinition<GetCardParamValuesParams> = {
  name: 'get_card_param_values',
  description: 'Get possible values for a card (saved question) filter parameter in Metabase',
  inputSchema: GetCardParamValuesParamsSchema,
  handler: async (client: MetabaseClient, input: GetCardParamValuesParams) => {
    const result = await client.get(
      `/api/card/${input.id}/params/${encodeURIComponent(input.param_key)}/values`,
    );
    return formatToolResponse(result);
  },
};
