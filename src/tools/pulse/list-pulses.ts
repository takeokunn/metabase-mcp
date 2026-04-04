import type { MetabaseClient } from '@src/client';
import { type ListPulsesInput, ListPulsesInputSchema } from '@src/schemas/pulse';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const listPulsesDefinition: ToolDefinition<ListPulsesInput> = {
  name: 'list_pulses',
  description: 'List all pulses in Metabase',
  inputSchema: ListPulsesInputSchema,
  handler: async (client: MetabaseClient, input: ListPulsesInput) => {
    const result = await client.get('/api/pulse', { archived: input.archived });
    return formatToolResponse(result);
  },
};
