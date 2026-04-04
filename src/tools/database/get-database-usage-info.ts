import type { MetabaseClient } from '@src/client';
import { type GetDatabaseParams, GetDatabaseParamsSchema } from '@src/schemas/database';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for getting usage info for a database
 */
export const getDatabaseUsageInfoDefinition: ToolDefinition<GetDatabaseParams> = {
  name: 'get_database_usage_info',
  description: 'Get usage information for a database in Metabase',
  inputSchema: GetDatabaseParamsSchema,
  handler: async (client: MetabaseClient, input: GetDatabaseParams) => {
    const result = await client.get(`/api/database/${input.id}/usage_info`);
    return formatToolResponse(result);
  },
};
