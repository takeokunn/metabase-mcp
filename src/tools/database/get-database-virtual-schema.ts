import type { MetabaseClient } from '@src/client';
import {
  type GetDatabaseVirtualSchemaParams,
  GetDatabaseVirtualSchemaParamsSchema,
} from '@src/schemas/database';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for getting a virtual schema (datasets) for a database
 */
export const getDatabaseVirtualSchemaDefinition: ToolDefinition<GetDatabaseVirtualSchemaParams> = {
  name: 'get_database_virtual_schema',
  description: 'Get a virtual schema (datasets) for a database in Metabase',
  inputSchema: GetDatabaseVirtualSchemaParamsSchema,
  handler: async (client: MetabaseClient, input: GetDatabaseVirtualSchemaParams) => {
    const result = await client.get(
      `/api/database/${input.id}/datasets/${encodeURIComponent(input.schema)}`,
    );
    return formatToolResponse(result);
  },
};
