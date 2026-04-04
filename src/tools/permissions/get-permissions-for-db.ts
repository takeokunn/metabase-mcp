import type { MetabaseClient } from '@src/client';
import {
  type GetDbPermissionsParams,
  GetDbPermissionsParamsSchema,
} from '@src/schemas/permissions';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for getting data permissions for a specific database in Metabase
 */
export const getPermissionsForDbDefinition: ToolDefinition<GetDbPermissionsParams> = {
  name: 'get_permissions_for_db',
  description: 'Get data permissions for a specific database in Metabase',
  inputSchema: GetDbPermissionsParamsSchema,
  handler: async (client: MetabaseClient, input: GetDbPermissionsParams) => {
    const result = await client.get(`/api/permissions/graph/db/${input.db_id}`);
    return formatToolResponse(result);
  },
};
