import type { MetabaseClient } from '@src/client';
import {
  type UpdateDataPermissionsInput,
  UpdateDataPermissionsInputSchema,
} from '@src/schemas/permissions';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for updating the data permissions graph in Metabase
 */
export const updateDataPermissionsDefinition: ToolDefinition<UpdateDataPermissionsInput> = {
  name: 'update_data_permissions',
  description: 'Update the data permissions graph for groups and databases in Metabase',
  inputSchema: UpdateDataPermissionsInputSchema,
  handler: async (client: MetabaseClient, input: UpdateDataPermissionsInput) => {
    const result = await client.put('/api/permissions/graph', {
      revision: input.revision,
      groups: input.groups,
    });
    return formatToolResponse(result);
  },
};
