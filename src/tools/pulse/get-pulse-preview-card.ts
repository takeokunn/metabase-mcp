import type { MetabaseClient } from '@src/client';
import { type GetPulsePreviewCardInput, GetPulsePreviewCardInputSchema } from '@src/schemas/pulse';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const getPulsePreviewCardDefinition: ToolDefinition<GetPulsePreviewCardInput> = {
  name: 'get_pulse_preview_card',
  description: 'Get a preview of a card for use in a pulse in Metabase',
  inputSchema: GetPulsePreviewCardInputSchema,
  handler: async (client: MetabaseClient, input: GetPulsePreviewCardInput) => {
    const result = await client.get(`/api/pulse/preview_card/${input.id}`);
    return formatToolResponse(result);
  },
};
