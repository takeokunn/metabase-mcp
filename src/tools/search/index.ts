import type { ToolDefinition } from '@src/tools/registry';
import { searchDefinition } from './search';

/**
 * All search-related tool definitions
 */
export const searchTools: ToolDefinition<unknown>[] = [
  searchDefinition,
];
