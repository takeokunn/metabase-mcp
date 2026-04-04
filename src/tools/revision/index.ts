import type { ToolDefinition } from '@src/tools/registry';
import { listRevisionsDefinition } from './list-revisions';
import { revertRevisionDefinition } from './revert-revision';

/**
 * All revision-related tool definitions
 */
export const revisionTools: ToolDefinition<unknown>[] = [
  listRevisionsDefinition,
  revertRevisionDefinition,
];
