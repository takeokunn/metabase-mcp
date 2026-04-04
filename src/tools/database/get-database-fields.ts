import type { MetabaseClient } from '@src/client';
import { type GetDatabaseFieldsParams, GetDatabaseFieldsParamsSchema } from '@src/schemas/database';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for listing all fields in a database
 */
export const getDatabaseFieldsDefinition: ToolDefinition<GetDatabaseFieldsParams> = {
  name: 'get_database_fields',
  description: 'Get all fields for a database in Metabase',
  inputSchema: GetDatabaseFieldsParamsSchema,
  handler: async (client: MetabaseClient, input: GetDatabaseFieldsParams) => {
    const result = await client.get(`/api/database/${input.id}/fields`);
    return formatToolResponse(result);
  },
};
