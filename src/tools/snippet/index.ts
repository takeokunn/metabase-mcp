import type { ToolDefinition } from '@src/tools/registry';
import { archiveSnippetDefinition } from './archive-snippet';
import { createSnippetDefinition } from './create-snippet';
import { getSnippetDefinition } from './get-snippet';
import { listSnippetsDefinition } from './list-snippets';
import { updateSnippetDefinition } from './update-snippet';

/**
 * All snippet-related tool definitions
 */
export const snippetTools: ToolDefinition<unknown>[] = [
  listSnippetsDefinition,
  getSnippetDefinition,
  createSnippetDefinition,
  updateSnippetDefinition,
  archiveSnippetDefinition,
];
