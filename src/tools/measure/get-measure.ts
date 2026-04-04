import type { MetabaseClient } from '@src/client';
import { type GetMeasureInput, GetMeasureInputSchema } from '@src/schemas/measure';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const getMeasureDefinition: ToolDefinition<GetMeasureInput> = {
  name: 'get_measure',
  description: 'Get a measure by ID in Metabase',
  inputSchema: GetMeasureInputSchema,
  handler: async (client: MetabaseClient, input: GetMeasureInput) => {
    const result = await client.get(`/api/measure/${input.id}`);
    return formatToolResponse(result);
  },
};
