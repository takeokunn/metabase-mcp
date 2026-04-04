import type { ToolDefinition } from '@src/tools/registry';
import { createModerationReviewDefinition } from './create-moderation-review';

export const moderationReviewTools: ToolDefinition<unknown>[] = [createModerationReviewDefinition];
