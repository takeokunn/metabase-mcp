import type { MetabaseClient } from '@src/client';
import {
  type GetDatabaseIdFieldsParams,
  GetDatabaseIdFieldsParamsSchema,
} from '@src/schemas/database';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for listing all ID-type fields in a database
 */
export const getDatabaseIdFieldsDefinition: ToolDefinition<GetDatabaseIdFieldsParams> = {
  name: 'get_database_id_fields',
  description: 'Get all ID-type fields for a database in Metabase',
  inputSchema: GetDatabaseIdFieldsParamsSchema,
  handler: async (client: MetabaseClient, input: GetDatabaseIdFieldsParams) => {
    const result = await client.get(`/api/database/${input.id}/idfields`, {
      include_editable_data_model: input.include_editable_data_model,
    });
    return formatToolResponse(result);
  },
};
