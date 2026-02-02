import type { ToolDefinition } from '@src/tools/registry';
import { createUserDefinition } from './create-user';
import { deleteUserDefinition } from './delete-user';
import { getCurrentUserDefinition } from './get-current-user';
import { getUserDefinition } from './get-user';
import { listUsersDefinition } from './list-users';
import { reactivateUserDefinition } from './reactivate-user';
import { sendInviteDefinition } from './send-invite';
import { updateUserDefinition } from './update-user';
import { updateUserPasswordDefinition } from './update-user-password';

/**
 * All user-related tool definitions
 */
export const userTools: ToolDefinition<unknown>[] = [
  listUsersDefinition,
  getUserDefinition,
  createUserDefinition,
  updateUserDefinition,
  deleteUserDefinition,
  getCurrentUserDefinition,
  updateUserPasswordDefinition,
  reactivateUserDefinition,
  sendInviteDefinition,
];
