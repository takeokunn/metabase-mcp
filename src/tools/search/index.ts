import type { ToolDefinition } from '@src/tools/registry';
import { forceReindexSearchDefinition } from './force-reindex-search';
import { getSearchWeightsDefinition } from './get-search-weights';
import { reinitSearchDefinition } from './reinit-search';
import { searchDefinition } from './search';
import { updateSearchWeightsDefinition } from './update-search-weights';

/**
 * All search-related tool definitions
 */
export const searchTools: ToolDefinition<unknown>[] = [
  searchDefinition,
  getSearchWeightsDefinition,
  updateSearchWeightsDefinition,
  forceReindexSearchDefinition,
  reinitSearchDefinition,
];
