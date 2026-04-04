import type { ToolDefinition } from '@src/tools/registry';
import { appendCsvToTableDefinition } from './append-csv-to-table';
import { checkDatabaseWorkspacePermissionDefinition } from './check-database-workspace-permission';
import { dismissDatabaseSpinnerDefinition } from './dismiss-database-spinner';
import { getDatabaseAvailableSettingsDefinition } from './get-database-available-settings';
import { getDatabaseCardAutocompleteDefinition } from './get-database-card-autocomplete';
import { getDatabaseSyncableSchemasDefinition } from './get-database-syncable-schemas';
import { getVirtualDatabaseDatasetsDefinition } from './get-virtual-database-datasets';
import { createDatabaseDefinition } from './create-database';
import { createSampleDatabaseDefinition } from './create-sample-database';
import { deleteDatabaseDefinition } from './delete-database';
import { discardDatabaseValuesDefinition } from './discard-database-values';
import { getDatabaseDefinition } from './get-database';
import { getDatabaseAutocompleteDefinition } from './get-database-autocomplete';
import { getDatabaseFieldsDefinition } from './get-database-fields';
import { getDatabaseHealthcheckDefinition } from './get-database-healthcheck';
import { getDatabaseIdFieldsDefinition } from './get-database-id-fields';
import { getDatabaseMetadataDefinition } from './get-database-metadata';
import { getDatabaseUsageInfoDefinition } from './get-database-usage-info';
import { getDatabaseVirtualSchemaDefinition } from './get-database-virtual-schema';
import { listDatabaseSchemasDefinition } from './list-database-schemas';
import { listDatabaseSchemasWithTablesDefinition } from './list-database-schemas-with-tables';
import { listDatabaseTablesDefinition } from './list-database-tables';
import { listDatabaseVirtualSchemaTablesDefinition } from './list-database-virtual-schema-tables';
import { listDatabaseVirtualTablesDefinition } from './list-database-virtual-tables';
import { listDatabasesDefinition } from './list-databases';
import { replaceTableCsvDefinition } from './replace-table-csv';
import { rescanDatabaseValuesDefinition } from './rescan-database-values';
import { syncDatabaseDefinition } from './sync-database';
import { syncDatabaseSchemaDefinition } from './sync-database-schema';
import { updateDatabaseDefinition } from './update-database';
import { uploadCsvToDatabaseDefinition } from './upload-csv-to-database';
import { validateDatabaseDefinition } from './validate-database';

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
  validateDatabaseDefinition,
  createSampleDatabaseDefinition,
  syncDatabaseSchemaDefinition,
  getDatabaseFieldsDefinition,
  getDatabaseIdFieldsDefinition,
  getDatabaseAutocompleteDefinition,
  getDatabaseUsageInfoDefinition,
  getDatabaseHealthcheckDefinition,
  listDatabaseSchemasWithTablesDefinition,
  listDatabaseVirtualTablesDefinition,
  getDatabaseVirtualSchemaDefinition,
  listDatabaseVirtualSchemaTablesDefinition,
  appendCsvToTableDefinition,
  replaceTableCsvDefinition,
  uploadCsvToDatabaseDefinition,
  getDatabaseCardAutocompleteDefinition,
  getDatabaseAvailableSettingsDefinition,
  getDatabaseSyncableSchemasDefinition,
  getVirtualDatabaseDatasetsDefinition,
  dismissDatabaseSpinnerDefinition,
  checkDatabaseWorkspacePermissionDefinition,
];
