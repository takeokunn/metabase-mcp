import type { ToolDefinition } from '@src/tools/registry';
import { clearEmailDefinition } from './clear-email';
import { configureEmailDefinition } from './configure-email';
import { testEmailDefinition } from './test-email';

/**
 * All email-related tool definitions
 */
export const emailTools: ToolDefinition<unknown>[] = [
  configureEmailDefinition,
  clearEmailDefinition,
  testEmailDefinition,
];
