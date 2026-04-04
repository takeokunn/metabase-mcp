import type { ToolDefinition } from '@src/tools/registry';
import { addMembershipDefinition } from './add-membership';
import { clearMembershipsDefinition } from './clear-memberships';
import { createPermissionGroupDefinition } from './create-permission-group';
import { deleteMembershipDefinition } from './delete-membership';
import { deletePermissionGroupDefinition } from './delete-permission-group';
import { getCollectionPermissionsDefinition } from './get-collection-permissions';
import { getDataPermissionsDefinition } from './get-data-permissions';
import { getPermissionGroupDefinition } from './get-permission-group';
import { getPermissionsForDbDefinition } from './get-permissions-for-db';
import { getPermissionsForGroupDefinition } from './get-permissions-for-group';
import { listMembershipsDefinition } from './list-memberships';
import { listPermissionGroupsDefinition } from './list-permission-groups';
import { updateCollectionPermissionsDefinition } from './update-collection-permissions';
import { updateDataPermissionsDefinition } from './update-data-permissions';
import { updateMembershipDefinition } from './update-membership';
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
  listMembershipsDefinition,
  addMembershipDefinition,
  updateMembershipDefinition,
  deleteMembershipDefinition,
  clearMembershipsDefinition,
  getPermissionsForDbDefinition,
  getPermissionsForGroupDefinition,
];
