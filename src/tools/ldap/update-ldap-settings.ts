import type { MetabaseClient } from '@src/client';
import { type UpdateLdapSettingsInput, UpdateLdapSettingsInputSchema } from '@src/schemas/ldap';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const updateLdapSettingsDefinition: ToolDefinition<UpdateLdapSettingsInput> = {
  name: 'update_ldap_settings',
  description: 'Update LDAP authentication settings in Metabase',
  inputSchema: UpdateLdapSettingsInputSchema,
  handler: async (client: MetabaseClient, input: UpdateLdapSettingsInput) => {
    const result = await client.put('/api/ldap/settings', input);
    return formatToolResponse(result);
  },
};
