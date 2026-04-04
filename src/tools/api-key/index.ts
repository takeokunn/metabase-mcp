import type { ToolDefinition } from '@src/tools/registry';
import { countApiKeysDefinition } from './count-api-keys';
import { createApiKeyDefinition } from './create-api-key';
import { deleteApiKeyDefinition } from './delete-api-key';
import { listApiKeysDefinition } from './list-api-keys';
import { regenerateApiKeyDefinition } from './regenerate-api-key';
import { updateApiKeyDefinition } from './update-api-key';

/**
 * All API key-related tool definitions
 */
export const apiKeyTools: ToolDefinition<unknown>[] = [
  listApiKeysDefinition,
  countApiKeysDefinition,
  createApiKeyDefinition,
  updateApiKeyDefinition,
  deleteApiKeyDefinition,
  regenerateApiKeyDefinition,
];
