import type { MetabaseClient } from '@src/client';
import { type GetNativeQueryInput, GetNativeQueryInputSchema } from '@src/schemas/dataset';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for converting an MBQL query to native SQL without executing it
 */
export const getNativeQueryDefinition: ToolDefinition<GetNativeQueryInput> = {
  name: 'get_native_query',
  description:
    'Convert an MBQL query to native SQL without executing it. Useful for inspecting what SQL Metabase would generate or for debugging query logic.',
  inputSchema: GetNativeQueryInputSchema,
  handler: async (client: MetabaseClient, input: GetNativeQueryInput) => {
    const result = await client.post('/api/dataset/native', {
      query: input.query,
    });
    return formatToolResponse(result);
  },
};
