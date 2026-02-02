import type { MetabaseClient } from '@src/client';
import {
  type UpdateCollectionPermissionsInput,
  UpdateCollectionPermissionsInputSchema,
} from '@src/schemas/permissions';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for updating the collection permissions graph in Metabase
 */
export const updateCollectionPermissionsDefinition: ToolDefinition<UpdateCollectionPermissionsInput> =
  {
    name: 'update_collection_permissions',
    description: 'Update the collection permissions graph for groups and collections in Metabase',
    inputSchema: UpdateCollectionPermissionsInputSchema,
    handler: async (client: MetabaseClient, input: UpdateCollectionPermissionsInput) => {
      const result = await client.put('/api/collection/graph', {
        revision: input.revision,
        groups: input.groups,
      });
      return formatToolResponse(result);
    },
  };
