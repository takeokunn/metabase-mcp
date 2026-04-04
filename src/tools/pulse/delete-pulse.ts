import type { MetabaseClient } from '@src/client';
import { type DeletePulseInput, DeletePulseInputSchema } from '@src/schemas/pulse';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const deletePulseDefinition: ToolDefinition<DeletePulseInput> = {
  name: 'delete_pulse',
  description: 'Delete a pulse in Metabase',
  inputSchema: DeletePulseInputSchema,
  handler: async (client: MetabaseClient, input: DeletePulseInput) => {
    const result = await client.delete(`/api/pulse/${input.id}`);
    return formatToolResponse(result);
  },
};
