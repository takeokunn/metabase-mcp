import type { ToolDefinition } from '@src/tools/registry';
import { getSearchContextDefinition } from './get-search-context';
import { listSearchIndexedEntitiesDefinition } from './list-search-indexed-entities';
import { searchDefinition } from './search';
import { searchModelsDefinition } from './search-models';

/**
 * All search-related tool definitions
 */
export const searchTools: ToolDefinition<unknown>[] = [
  searchDefinition,
  searchModelsDefinition,
  getSearchContextDefinition,
  listSearchIndexedEntitiesDefinition,
];
