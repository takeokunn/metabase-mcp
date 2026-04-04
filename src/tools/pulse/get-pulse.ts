import type { MetabaseClient } from '@src/client';
import { type GetPulseInput, GetPulseInputSchema } from '@src/schemas/pulse';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const getPulseDefinition: ToolDefinition<GetPulseInput> = {
  name: 'get_pulse',
  description: 'Get details of a specific pulse in Metabase',
  inputSchema: GetPulseInputSchema,
  handler: async (client: MetabaseClient, input: GetPulseInput) => {
    const result = await client.get(`/api/pulse/${input.id}`);
    return formatToolResponse(result);
  },
};
