import type { MetabaseClient } from '@src/client';
import { type UpdateMetabotSettingsInput, UpdateMetabotSettingsInputSchema } from '@src/schemas/metabot';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const updateMetabotSettingsDefinition: ToolDefinition<UpdateMetabotSettingsInput> = {
  name: 'update_metabot_settings',
  description: '[Requires Metabase Pro] Update Metabot settings',
  inputSchema: UpdateMetabotSettingsInputSchema,
  handler: async (client: MetabaseClient, input: UpdateMetabotSettingsInput) => {
    const result = await client.put('/api/metabot/settings', input.settings);
    return formatToolResponse(result);
  },
};
