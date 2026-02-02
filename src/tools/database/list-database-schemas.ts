import type { MetabaseClient } from '@src/client';
import { type GetDatabaseParams, GetDatabaseParamsSchema } from '@src/schemas/database';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for listing schemas in a database
 */
export const listDatabaseSchemasDefinition: ToolDefinition<GetDatabaseParams> = {
  name: 'list_database_schemas',
  description: 'List all schemas in a database from Metabase',
  inputSchema: GetDatabaseParamsSchema,
  handler: async (client: MetabaseClient, input: GetDatabaseParams) => {
    const schemas = await client.get(`/api/database/${input.id}/schemas`);
    return formatToolResponse(schemas);
  },
};
