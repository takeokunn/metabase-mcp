import type { MetabaseClient } from '@src/client';
import { type BulkUpdateSettingsInput, BulkUpdateSettingsInputSchema } from '@src/schemas/setting';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for bulk updating multiple Metabase settings at once
 */
export const bulkUpdateSettingsDefinition: ToolDefinition<BulkUpdateSettingsInput> = {
  name: 'bulk_update_settings',
  description: 'Update multiple Metabase settings at once (admin only)',
  inputSchema: BulkUpdateSettingsInputSchema,
  handler: async (client: MetabaseClient, input: BulkUpdateSettingsInput) => {
    const result = await client.put('/api/setting', input.settings);
    return formatToolResponse(result);
  },
};
