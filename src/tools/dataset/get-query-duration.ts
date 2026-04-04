import type { MetabaseClient } from '@src/client';
import { type GetQueryDurationInput, GetQueryDurationInputSchema } from '@src/schemas/dataset';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for getting estimated query execution duration
 */
export const getQueryDurationDefinition: ToolDefinition<GetQueryDurationInput> = {
  name: 'get_query_duration',
  description:
    'Get the estimated execution duration for an MBQL query before running it. Useful for predicting performance impact of expensive queries.',
  inputSchema: GetQueryDurationInputSchema,
  handler: async (client: MetabaseClient, input: GetQueryDurationInput) => {
    const result = await client.post('/api/dataset/duration', {
      query: input.query,
    });
    return formatToolResponse(result);
  },
};
