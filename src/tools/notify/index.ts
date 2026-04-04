import type { ToolDefinition } from '@src/tools/registry';
import { notifyDatabaseSyncDefinition } from './notify-database-sync';
import { notifyDatabaseSyncByNameDefinition } from './notify-database-sync-by-name';
import { notifySlackEventDefinition } from './notify-slack-event';

/**
 * All notify-related tool definitions
 */
export const notifyTools: ToolDefinition<unknown>[] = [
  notifyDatabaseSyncDefinition,
  notifyDatabaseSyncByNameDefinition,
  notifySlackEventDefinition,
];
