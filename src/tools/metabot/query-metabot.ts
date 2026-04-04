import type { MetabaseClient } from '@src/client';
import { type QueryMetabotInput, QueryMetabotInputSchema } from '@src/schemas/metabot';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const queryMetabotDefinition: ToolDefinition<QueryMetabotInput> = {
  name: 'query_metabot',
  description: '[Requires Metabase Pro] Send a message to the Metabot AI agent and receive a response',
  inputSchema: QueryMetabotInputSchema,
  handler: async (client: MetabaseClient, input: QueryMetabotInput) => {
    const result = await client.post('/api/metabot/agent', {
      message: input.message,
      context: input.context,
    });
    return formatToolResponse(result);
  },
};
