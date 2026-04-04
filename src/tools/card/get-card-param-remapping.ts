import type { MetabaseClient } from '@src/client';
import {
  type GetCardParamRemappingInput,
  GetCardParamRemappingInputSchema,
} from '@src/schemas/card';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const getCardParamRemappingDefinition: ToolDefinition<GetCardParamRemappingInput> = {
  name: 'get_card_param_remapping',
  description: 'Get remapping for a parameter of a card in Metabase',
  inputSchema: GetCardParamRemappingInputSchema,
  handler: async (client: MetabaseClient, input: GetCardParamRemappingInput) => {
    const result = await client.get(
      `/api/card/${input.card_id}/params/${input.param_key}/remapping`,
    );
    return formatToolResponse(result);
  },
};
