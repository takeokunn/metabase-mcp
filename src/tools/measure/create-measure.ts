import type { MetabaseClient } from '@src/client';
import { type CreateMeasureInput, CreateMeasureInputSchema } from '@src/schemas/measure';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const createMeasureDefinition: ToolDefinition<CreateMeasureInput> = {
  name: 'create_measure',
  description: 'Create a new measure in Metabase',
  inputSchema: CreateMeasureInputSchema,
  handler: async (client: MetabaseClient, input: CreateMeasureInput) => {
    const result = await client.post('/api/measure', { name: input.name, definition: input.definition });
    return formatToolResponse(result);
  },
};
