import type { ToolDefinition } from '@src/tools/registry';
import { addCommentReactionDefinition } from './add-comment-reaction';
import { createCommentDefinition } from './create-comment';
import { deleteCommentDefinition } from './delete-comment';
import { getCommentMentionsDefinition } from './get-comment-mentions';
import { listCommentsDefinition } from './list-comments';
import { updateCommentDefinition } from './update-comment';

export const commentTools: ToolDefinition<unknown>[] = [
  listCommentsDefinition,
  createCommentDefinition,
  updateCommentDefinition,
  deleteCommentDefinition,
  addCommentReactionDefinition,
  getCommentMentionsDefinition,
];
