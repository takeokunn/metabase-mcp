import type { MetabaseClient } from '@src/client';
import { type GetPulseFormInputInput, GetPulseFormInputInputSchema } from '@src/schemas/pulse';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const getPulseFormInputDefinition: ToolDefinition<GetPulseFormInputInput> = {
  name: 'get_pulse_form_input',
  description: 'Get form input options for creating a pulse in Metabase',
  inputSchema: GetPulseFormInputInputSchema,
  handler: async (client: MetabaseClient, _input: GetPulseFormInputInput) => {
    const result = await client.get('/api/pulse/form_input');
    return formatToolResponse(result);
  },
};
