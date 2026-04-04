import type { MetabaseClient } from '@src/client';
import {
  type HardDeleteCollectionInput,
  HardDeleteCollectionInputSchema,
} from '@src/schemas/collection';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for permanently (hard) deleting a collection in Metabase
 */
export const hardDeleteCollectionDefinition: ToolDefinition<HardDeleteCollectionInput> = {
  name: 'hard_delete_collection',
  description: 'Permanently delete a collection in Metabase (cannot be undone)',
  inputSchema: HardDeleteCollectionInputSchema,
  handler: async (client: MetabaseClient, input: HardDeleteCollectionInput) => {
    const result = await client.delete(`/api/collection/${input.id}`);
    return formatToolResponse(result);
  },
};
