import type { MetabaseClient } from '@src/client';
import { type UpdateSlackSettingsInput, UpdateSlackSettingsInputSchema } from '@src/schemas/slack';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const updateSlackSettingsDefinition: ToolDefinition<UpdateSlackSettingsInput> = {
  name: 'update_slack_settings',
  description: '[Requires Metabase Pro] Update Slack integration settings in Metabase',
  inputSchema: UpdateSlackSettingsInputSchema,
  handler: async (client: MetabaseClient, input: UpdateSlackSettingsInput) => {
    const result = await client.put('/api/slack/settings', input);
    return formatToolResponse(result);
  },
};
