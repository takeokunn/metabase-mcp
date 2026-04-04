import type { ToolDefinition } from '@src/tools/registry';
import { deleteCacheConfigDefinition } from './delete-cache-config';
import { getCacheConfigDefinition } from './get-cache-config';
import { invalidateCacheDefinition } from './invalidate-cache';
import { updateCacheConfigDefinition } from './update-cache-config';

export const cacheTools: ToolDefinition<unknown>[] = [
  getCacheConfigDefinition,
  updateCacheConfigDefinition,
  deleteCacheConfigDefinition,
  invalidateCacheDefinition,
];
