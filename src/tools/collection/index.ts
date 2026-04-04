import type { ToolDefinition } from '@src/tools/registry';
import { createCollectionDefinition } from './create-collection';
import { deleteCollectionDefinition } from './delete-collection';
import { getCollectionDefinition } from './get-collection';
import { getCollectionItemsDefinition } from './get-collection-items';
import { getCollectionPermissionGraphDefinition } from './get-collection-permission-graph';
import { getCollectionTreeDefinition } from './get-collection-tree';
import { getRootCollectionDefinition } from './get-root-collection';
import { getRootCollectionItemsDefinition } from './get-root-collection-items';
import { getTrashCollectionDefinition } from './get-trash-collection';
import { getTrashCollectionItemsDefinition } from './get-trash-collection-items';
import { hardDeleteCollectionDefinition } from './hard-delete-collection';
import { listCollectionsDefinition } from './list-collections';
import { moveCollectionItemsDefinition } from './move-collection-items';
import { restoreCollectionDefinition } from './restore-collection';
import { updateCollectionDefinition } from './update-collection';

/**
 * All collection-related tool definitions
 */
export const collectionTools: ToolDefinition<unknown>[] = [
  listCollectionsDefinition,
  getCollectionDefinition,
  getCollectionItemsDefinition,
  getCollectionTreeDefinition,
  getRootCollectionDefinition,
  getRootCollectionItemsDefinition,
  getTrashCollectionDefinition,
  getTrashCollectionItemsDefinition,
  createCollectionDefinition,
  updateCollectionDefinition,
  deleteCollectionDefinition,
  hardDeleteCollectionDefinition,
  restoreCollectionDefinition,
  moveCollectionItemsDefinition,
  getCollectionPermissionGraphDefinition,
];
