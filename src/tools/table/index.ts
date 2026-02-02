import type { ToolDefinition } from '@src/tools/registry';
import { getTableDefinition } from './get-table';
import { getTableMetadataDefinition } from './get-table-metadata';
import { listTableFieldsDefinition } from './list-table-fields';
import { resyncTableFieldsDefinition } from './resync-table-fields';
import { updateTableDefinition } from './update-table';

/**
 * All table-related tool definitions
 */
export const tableTools: ToolDefinition<unknown>[] = [
  getTableDefinition,
  getTableMetadataDefinition,
  updateTableDefinition,
  listTableFieldsDefinition,
  resyncTableFieldsDefinition,
];
