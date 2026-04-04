import type { MetabaseClient } from '@src/client';
import {
  type GetCollectionPermissionGraphParams,
  GetCollectionPermissionGraphParamsSchema,
} from '@src/schemas/collection';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for getting the permission graph for a collection in Metabase
 */
export const getCollectionPermissionGraphDefinition: ToolDefinition<GetCollectionPermissionGraphParams> =
  {
    name: 'get_collection_permission_graph',
    description: 'Get the permission graph for a collection in Metabase',
    inputSchema: GetCollectionPermissionGraphParamsSchema,
    handler: async (client: MetabaseClient, input: GetCollectionPermissionGraphParams) => {
      const result = await client.get(`/api/collection/${input.id}/permission-graph`);
      return formatToolResponse(result);
    },
  };
