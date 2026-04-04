import type { MetabaseClient } from '@src/client';
import {
  type DeleteDatabaseSchemaParams,
  DeleteDatabaseSchemaParamsSchema,
} from '@src/schemas/database';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for listing tables within a specific schema in a database
 */
export const listDatabaseSchemasWithTablesDefinition: ToolDefinition<DeleteDatabaseSchemaParams> = {
  name: 'list_database_schemas_with_tables',
  description: 'List all tables within a specific schema of a database in Metabase',
  inputSchema: DeleteDatabaseSchemaParamsSchema,
  handler: async (client: MetabaseClient, input: DeleteDatabaseSchemaParams) => {
    const result = await client.get(
      `/api/database/${input.id}/schema/${encodeURIComponent(input.schema)}`,
    );
    return formatToolResponse(result);
  },
};
