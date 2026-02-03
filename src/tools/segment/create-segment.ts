import type { MetabaseClient } from '@src/client';
import { type CreateSegmentInput, CreateSegmentInputSchema } from '@src/schemas/segment';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for creating a new segment in Metabase
 */
export const createSegmentDefinition: ToolDefinition<CreateSegmentInput> = {
  name: 'create_segment',
  description: 'Create a new segment in Metabase',
  inputSchema: CreateSegmentInputSchema,
  handler: async (client: MetabaseClient, input: CreateSegmentInput) => {
    const result = await client.post('/api/segment', {
      name: input.name,
      table_id: input.table_id,
      definition: input.definition,
      description: input.description,
    });
    return formatToolResponse(result);
  },
};
