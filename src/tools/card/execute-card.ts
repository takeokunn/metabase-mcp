import type { MetabaseClient } from '@src/client';
import { type ExecuteCardParams, ExecuteCardParamsSchema } from '@src/schemas/card';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for executing a card (saved question) and returning query results
 */
export const executeCardDefinition: ToolDefinition<ExecuteCardParams> = {
  name: 'execute_card',
  description: 'Execute a card (saved question) and return the query results',
  inputSchema: ExecuteCardParamsSchema,
  handler: async (client: MetabaseClient, input: ExecuteCardParams) => {
    const body = input.parameters ? { parameters: input.parameters } : undefined;
    const result = await client.post(`/api/card/${input.id}/query`, body);
    return formatToolResponse(result);
  },
};
