import type { MetabaseClient } from '@src/client';
import { type GetDatabaseParams, GetDatabaseParamsSchema } from '@src/schemas/database';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for getting a single database by ID
 */
export const getDatabaseDefinition: ToolDefinition<GetDatabaseParams> = {
  name: 'get_database',
  description: 'Get a single database by ID from Metabase',
  inputSchema: GetDatabaseParamsSchema,
  handler: async (client: MetabaseClient, input: GetDatabaseParams) => {
    const database = await client.get(`/api/database/${input.id}`);
    return formatToolResponse(database);
  },
};
