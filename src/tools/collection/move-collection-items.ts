import type { MetabaseClient } from '@src/client';
import {
  type MoveCollectionItemsInput,
  MoveCollectionItemsInputSchema,
} from '@src/schemas/collection';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for moving items from one collection to another in Metabase
 */
export const moveCollectionItemsDefinition: ToolDefinition<MoveCollectionItemsInput> = {
  name: 'move_collection_items',
  description: 'Move items from a source collection to a destination collection in Metabase',
  inputSchema: MoveCollectionItemsInputSchema,
  handler: async (client: MetabaseClient, input: MoveCollectionItemsInput) => {
    const result = await client.post(
      `/api/collection/${input.source_collection_id}/move-to-collection`,
      {
        destination_collection_id: input.destination_collection_id,
        items: input.items,
      },
    );
    return formatToolResponse(result);
  },
};
