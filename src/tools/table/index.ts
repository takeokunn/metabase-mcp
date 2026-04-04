import type { ToolDefinition } from '@src/tools/registry';
import { bulkUpdateTablesDefinition } from './bulk-update-tables';
import { discardTableValuesDefinition } from './discard-table-values';
import { getTableDefinition } from './get-table';
import { getTableForeignKeysDefinition } from './get-table-foreign-keys';
import { getTableMetadataDefinition } from './get-table-metadata';
import { getTableRelatedDefinition } from './get-table-related';
import { listAllTablesDefinition } from './list-all-tables';
import { resyncTableFieldsDefinition } from './resync-table-fields';
import { syncTableSchemaDefinition } from './sync-table-schema';
import { updateTableDefinition } from './update-table';
import { updateTableFieldsOrderDefinition } from './update-table-fields-order';
import { getVirtualCardTableFksDefinition } from './get-virtual-card-table-fks';
import { getVirtualCardTableQueryMetadataDefinition } from './get-virtual-card-table-query-metadata';
import { getTableDataDefinition } from './get-table-data';

/**
 * All table-related tool definitions
 */
export const tableTools: ToolDefinition<unknown>[] = [
  listAllTablesDefinition,
  getTableDefinition,
  getTableMetadataDefinition,
  updateTableDefinition,
  bulkUpdateTablesDefinition,
  resyncTableFieldsDefinition,
  getTableForeignKeysDefinition,
  syncTableSchemaDefinition,
  discardTableValuesDefinition,
  getTableRelatedDefinition,
  updateTableFieldsOrderDefinition,
  getVirtualCardTableFksDefinition,
  getVirtualCardTableQueryMetadataDefinition,
  getTableDataDefinition,
];
