import type { MetabaseClient } from '@src/client';
import { type UpdateMeasureInput, UpdateMeasureInputSchema } from '@src/schemas/measure';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const updateMeasureDefinition: ToolDefinition<UpdateMeasureInput> = {
  name: 'update_measure',
  description: 'Update a measure by ID in Metabase',
  inputSchema: UpdateMeasureInputSchema,
  handler: async (client: MetabaseClient, input: UpdateMeasureInput) => {
    const result = await client.put(`/api/measure/${input.id}`, {
      name: input.name,
      definition: input.definition,
    });
    return formatToolResponse(result);
  },
};
