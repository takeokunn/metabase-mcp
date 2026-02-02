import type { ToolDefinition } from '@src/tools/registry';
import { createPermissionGroupDefinition } from './create-permission-group';
import { deletePermissionGroupDefinition } from './delete-permission-group';
import { getCollectionPermissionsDefinition } from './get-collection-permissions';
import { getDataPermissionsDefinition } from './get-data-permissions';
import { getPermissionGroupDefinition } from './get-permission-group';
import { listPermissionGroupsDefinition } from './list-permission-groups';
import { updateCollectionPermissionsDefinition } from './update-collection-permissions';
import { updateDataPermissionsDefinition } from './update-data-permissions';
import { updatePermissionGroupDefinition } from './update-permission-group';

/**
 * All permissions-related tool definitions
 */
export const permissionsTools: ToolDefinition<unknown>[] = [
  listPermissionGroupsDefinition,
  getPermissionGroupDefinition,
  createPermissionGroupDefinition,
  updatePermissionGroupDefinition,
  deletePermissionGroupDefinition,
  getDataPermissionsDefinition,
  updateDataPermissionsDefinition,
  getCollectionPermissionsDefinition,
  updateCollectionPermissionsDefinition,
];
