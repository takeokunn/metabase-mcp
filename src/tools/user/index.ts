import type { ToolDefinition } from '@src/tools/registry';
import { createUserDefinition } from './create-user';
import { dismissUserModalDefinition } from './dismiss-user-modal';
import { deleteUserDefinition } from './delete-user';
import { getCurrentUserDefinition } from './get-current-user';
import { getUserDefinition } from './get-user';
import { getUserRecipientsDefinition } from './get-user-recipients';
import { listUsersDefinition } from './list-users';
import { reactivateUserDefinition } from './reactivate-user';
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
  getUserRecipientsDefinition,
  dismissUserModalDefinition,
];
