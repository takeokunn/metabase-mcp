import type { MetabaseClient } from '@src/client';
import { type GetDatabaseAvailableSettingsParams, GetDatabaseAvailableSettingsParamsSchema } from '@src/schemas/database';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const getDatabaseAvailableSettingsDefinition: ToolDefinition<GetDatabaseAvailableSettingsParams> = {
  name: 'get_database_available_settings',
  description: 'Get available settings for a database connection in Metabase',
  inputSchema: GetDatabaseAvailableSettingsParamsSchema,
  handler: async (client: MetabaseClient, input: GetDatabaseAvailableSettingsParams) => {
    const result = await client.get(`/api/database/${input.id}/settings-available`);
    return formatToolResponse(result);
  },
};
