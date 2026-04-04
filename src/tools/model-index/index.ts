import type { ToolDefinition } from '@src/tools/registry';
import { createModelIndexDefinition } from './create-model-index';
import { deleteModelIndexDefinition } from './delete-model-index';
import { getModelIndexDefinition } from './get-model-index';
import { listModelIndexesDefinition } from './list-model-indexes';

/**
 * All model-index-related tool definitions
 */
export const modelIndexTools: ToolDefinition<unknown>[] = [
  listModelIndexesDefinition,
  getModelIndexDefinition,
  createModelIndexDefinition,
  deleteModelIndexDefinition,
];
