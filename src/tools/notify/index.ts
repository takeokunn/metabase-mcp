import type { ToolDefinition } from '@src/tools/registry';
import { notifyDatabaseSyncDefinition } from './notify-database-sync';
import { notifyDatabaseSyncByNameDefinition } from './notify-database-sync-by-name';

/**
 * All notify-related tool definitions
 */
export const notifyTools: ToolDefinition<unknown>[] = [
  notifyDatabaseSyncDefinition,
  notifyDatabaseSyncByNameDefinition,
];
