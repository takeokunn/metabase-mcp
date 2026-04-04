import type { MetabaseClient } from '@src/client';
import { type FormatQueryForVizInput, FormatQueryForVizInputSchema } from '@src/schemas/dataset';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for formatting a query for visualization
 */
export const formatQueryDefinition: ToolDefinition<FormatQueryForVizInput> = {
  name: 'format_query',
  description:
    'Format an MBQL query for use with a specific visualization type. Returns the query structured appropriately for rendering in Metabase charts.',
  inputSchema: FormatQueryForVizInputSchema,
  handler: async (client: MetabaseClient, input: FormatQueryForVizInput) => {
    const result = await client.post('/api/dataset/format_query_for_viz', {
      query: input.query,
    });
    return formatToolResponse(result);
  },
};
