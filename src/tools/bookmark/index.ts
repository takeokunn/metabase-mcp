import type { ToolDefinition } from '@src/tools/registry';
import { createBookmarkDefinition } from './create-bookmark';
import { deleteBookmarkDefinition } from './delete-bookmark';
import { listBookmarksDefinition } from './list-bookmarks';
import { reorderBookmarksDefinition } from './reorder-bookmarks';

/**
 * All bookmark-related tool definitions
 */
export const bookmarkTools: ToolDefinition<unknown>[] = [
  listBookmarksDefinition,
  createBookmarkDefinition,
  deleteBookmarkDefinition,
  reorderBookmarksDefinition,
];
