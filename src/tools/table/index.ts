import type { ToolDefinition } from '@src/tools/registry';
import { bulkUpdateTablesDefinition } from './bulk-update-tables';
import { discardTableValuesDefinition } from './discard-table-values';
import { getTableDefinition } from './get-table';
import { getTableEntityIdDefinition } from './get-table-entity-id';
import { getTableForeignKeysDefinition } from './get-table-foreign-keys';
import { getTableMetadataDefinition } from './get-table-metadata';
import { getTableRelatedDefinition } from './get-table-related';
import { listAllTablesDefinition } from './list-all-tables';
import { listTableFieldsDefinition } from './list-table-fields';
import { resyncTableFieldsDefinition } from './resync-table-fields';
import { syncTableSchemaDefinition } from './sync-table-schema';
import { updateTableDefinition } from './update-table';
import { updateTableFieldsOrderDefinition } from './update-table-fields-order';

/**
 * All table-related tool definitions
 */
export const tableTools: ToolDefinition<unknown>[] = [
  listAllTablesDefinition,
  getTableDefinition,
  getTableMetadataDefinition,
  updateTableDefinition,
  bulkUpdateTablesDefinition,
  listTableFieldsDefinition,
  resyncTableFieldsDefinition,
  getTableForeignKeysDefinition,
  syncTableSchemaDefinition,
  discardTableValuesDefinition,
  getTableEntityIdDefinition,
  getTableRelatedDefinition,
  updateTableFieldsOrderDefinition,
];
