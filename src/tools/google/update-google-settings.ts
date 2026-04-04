import type { MetabaseClient } from '@src/client';
import {
  type UpdateGoogleSettingsInput,
  UpdateGoogleSettingsInputSchema,
} from '@src/schemas/google';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const updateGoogleSettingsDefinition: ToolDefinition<UpdateGoogleSettingsInput> = {
  name: 'update_google_settings',
  description: 'Update Google authentication settings in Metabase',
  inputSchema: UpdateGoogleSettingsInputSchema,
  handler: async (client: MetabaseClient, input: UpdateGoogleSettingsInput) => {
    const result = await client.put('/api/google/settings', input);
    return formatToolResponse(result);
  },
};
