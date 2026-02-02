import type { ToolDefinition } from '@src/tools/registry';
import { createDatabaseDefinition } from './create-database';
import { deleteDatabaseDefinition } from './delete-database';
import { discardDatabaseValuesDefinition } from './discard-database-values';
import { getDatabaseDefinition } from './get-database';
import { getDatabaseMetadataDefinition } from './get-database-metadata';
import { listDatabaseSchemasDefinition } from './list-database-schemas';
import { listDatabaseTablesDefinition } from './list-database-tables';
import { listDatabasesDefinition } from './list-databases';
import { rescanDatabaseValuesDefinition } from './rescan-database-values';
import { syncDatabaseDefinition } from './sync-database';
import { updateDatabaseDefinition } from './update-database';

/**
 * All database-related tool definitions
 */
export const databaseTools: ToolDefinition<unknown>[] = [
  listDatabasesDefinition,
  getDatabaseDefinition,
  getDatabaseMetadataDefinition,
  listDatabaseSchemasDefinition,
  listDatabaseTablesDefinition,
  syncDatabaseDefinition,
  createDatabaseDefinition,
  updateDatabaseDefinition,
  deleteDatabaseDefinition,
  rescanDatabaseValuesDefinition,
  discardDatabaseValuesDefinition,
];
