import type { ToolDefinition } from '@src/tools/registry';
import { deleteUserKeyValueDefinition } from './delete-user-key-value';
import { getUserKeyValueDefinition } from './get-user-key-value';
import { listUserNamespaceValuesDefinition } from './list-user-namespace-values';
import { putUserKeyValueDefinition } from './put-user-key-value';

export const userKeyValueTools: ToolDefinition<unknown>[] = [
  getUserKeyValueDefinition,
  putUserKeyValueDefinition,
  deleteUserKeyValueDefinition,
  listUserNamespaceValuesDefinition,
];
