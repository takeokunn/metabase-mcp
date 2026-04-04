import type { ToolDefinition } from '@src/tools/registry';
import { cancelCloudMigrationDefinition } from './cancel-cloud-migration';
import { getCloudMigrationDefinition } from './get-cloud-migration';
import { initiateCloudMigrationDefinition } from './initiate-cloud-migration';

export const cloudMigrationTools: ToolDefinition<unknown>[] = [
  initiateCloudMigrationDefinition,
  getCloudMigrationDefinition,
  cancelCloudMigrationDefinition,
];
