import type { MetabaseClient } from '@src/client';
import { type ExecuteCardPivotParams, ExecuteCardPivotParamsSchema } from '@src/schemas/card';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for executing a card as a pivot table query in Metabase
 */
export const executeCardPivotDefinition: ToolDefinition<ExecuteCardPivotParams> = {
  name: 'execute_card_pivot',
  description: 'Execute a card (saved question) as a pivot table query in Metabase',
  inputSchema: ExecuteCardPivotParamsSchema,
  handler: async (client: MetabaseClient, input: ExecuteCardPivotParams) => {
    const body = input.parameters ? { parameters: input.parameters } : undefined;
    const result = await client.post(`/api/card/${input.id}/query/pivot`, body);
    return formatToolResponse(result);
  },
};
