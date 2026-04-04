import type { MetabaseClient } from '@src/client';
import {
  type RestoreCollectionInput,
  RestoreCollectionInputSchema,
} from '@src/schemas/collection';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for restoring a collection from trash in Metabase
 */
export const restoreCollectionDefinition: ToolDefinition<RestoreCollectionInput> = {
  name: 'restore_collection',
  description: 'Restore a collection from the trash in Metabase',
  inputSchema: RestoreCollectionInputSchema,
  handler: async (client: MetabaseClient, input: RestoreCollectionInput) => {
    const result = await client.post(`/api/collection/${input.id}/restore`);
    return formatToolResponse(result);
  },
};
