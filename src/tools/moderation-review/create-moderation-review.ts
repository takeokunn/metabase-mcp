import type { MetabaseClient } from '@src/client';
import { type CreateModerationReviewInput, CreateModerationReviewInputSchema } from '@src/schemas/moderation-review';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const createModerationReviewDefinition: ToolDefinition<CreateModerationReviewInput> = {
  name: 'create_moderation_review',
  description: 'Create a moderation review for a Metabase item (card, dashboard, etc.)',
  inputSchema: CreateModerationReviewInputSchema,
  handler: async (client: MetabaseClient, input: CreateModerationReviewInput) => {
    const result = await client.post('/api/moderation-review', {
      moderated_item_id: input.moderated_item_id,
      moderated_item_type: input.moderated_item_type,
      status: input.status,
      text: input.text,
    });
    return formatToolResponse(result);
  },
};
