import type { ToolDefinition } from '@src/tools/registry';
import { searchDefinition } from './search';
import { searchModelsDefinition } from './search-models';

/**
 * All search-related tool definitions
 */
export const searchTools: ToolDefinition<unknown>[] = [searchDefinition, searchModelsDefinition];
