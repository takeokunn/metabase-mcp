import type { ToolDefinition } from '@src/tools/registry';
import { createCollectionDefinition } from './create-collection';
import { deleteCollectionDefinition } from './delete-collection';
import { getCollectionDefinition } from './get-collection';
import { getCollectionItemsDefinition } from './get-collection-items';
import { getCollectionTreeDefinition } from './get-collection-tree';
import { listCollectionsDefinition } from './list-collections';
import { updateCollectionDefinition } from './update-collection';

/**
 * All collection-related tool definitions
 */
export const collectionTools: ToolDefinition<unknown>[] = [
  listCollectionsDefinition,
  getCollectionDefinition,
  getCollectionItemsDefinition,
  getCollectionTreeDefinition,
  createCollectionDefinition,
  updateCollectionDefinition,
  deleteCollectionDefinition,
];
