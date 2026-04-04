import type { MetabaseClient } from '@src/client';
import { type GetDatabaseParams, GetDatabaseParamsSchema } from '@src/schemas/database';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for getting the entity ID of a database (used for serialization)
 */
export const getDatabaseEntityIdDefinition: ToolDefinition<GetDatabaseParams> = {
  name: 'get_database_entity_id',
  description: 'Get the entity ID of a database in Metabase (used for serialization)',
  inputSchema: GetDatabaseParamsSchema,
  handler: async (client: MetabaseClient, input: GetDatabaseParams) => {
    const result = await client.get(`/api/database/${input.id}/entity_id`);
    return formatToolResponse(result);
  },
};
