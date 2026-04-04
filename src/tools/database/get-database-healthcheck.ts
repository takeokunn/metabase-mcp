import type { MetabaseClient } from '@src/client';
import { type GetDatabaseParams, GetDatabaseParamsSchema } from '@src/schemas/database';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for performing a healthcheck on a database
 */
export const getDatabaseHealthcheckDefinition: ToolDefinition<GetDatabaseParams> = {
  name: 'get_database_healthcheck',
  description: 'Perform a healthcheck on a database connection in Metabase',
  inputSchema: GetDatabaseParamsSchema,
  handler: async (client: MetabaseClient, input: GetDatabaseParams) => {
    const result = await client.get(`/api/database/${input.id}/healthcheck`);
    return formatToolResponse(result);
  },
};
