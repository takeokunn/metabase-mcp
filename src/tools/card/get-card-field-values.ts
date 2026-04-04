import type { MetabaseClient } from '@src/client';
import { type GetCardFieldValuesParams, GetCardFieldValuesParamsSchema } from '@src/schemas/card';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for getting possible values for a field used in a card in Metabase
 */
export const getCardFieldValuesDefinition: ToolDefinition<GetCardFieldValuesParams> = {
  name: 'get_card_field_values',
  description: 'Get possible values for a field used in a card (saved question) in Metabase',
  inputSchema: GetCardFieldValuesParamsSchema,
  handler: async (client: MetabaseClient, input: GetCardFieldValuesParams) => {
    const result = await client.get(`/api/card/${input.id}/field/${input.field_id}/values`);
    return formatToolResponse(result);
  },
};
