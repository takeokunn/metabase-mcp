import type { ToolDefinition } from '@src/tools/registry';
import { createCollectionDefinition } from './create-collection';
import { deleteCollectionDefinition } from './delete-collection';
import { getCollectionDefinition } from './get-collection';
import { getCollectionDashboardQuestionCandidatesDefinition } from './get-collection-dashboard-question-candidates';
import { getCollectionItemsDefinition } from './get-collection-items';
import { getCollectionTreeDefinition } from './get-collection-tree';
import { getRootCollectionDefinition } from './get-root-collection';
import { getRootCollectionItemsDefinition } from './get-root-collection-items';
import { getRootDashboardQuestionCandidatesDefinition } from './get-root-dashboard-question-candidates';
import { getTrashCollectionDefinition } from './get-trash-collection';
import { hardDeleteCollectionDefinition } from './hard-delete-collection';
import { listCollectionsDefinition } from './list-collections';
import { moveCollectionDashboardQuestionCandidatesDefinition } from './move-collection-dashboard-question-candidates';
import { moveRootDashboardQuestionCandidatesDefinition } from './move-root-dashboard-question-candidates';
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
  createCollectionDefinition,
  updateCollectionDefinition,
  deleteCollectionDefinition,
  hardDeleteCollectionDefinition,
  getRootDashboardQuestionCandidatesDefinition,
  getCollectionDashboardQuestionCandidatesDefinition,
  moveRootDashboardQuestionCandidatesDefinition,
  moveCollectionDashboardQuestionCandidatesDefinition,
];
