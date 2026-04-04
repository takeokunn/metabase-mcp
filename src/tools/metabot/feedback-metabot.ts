import type { MetabaseClient } from '@src/client';
import { type FeedbackMetabotInput, FeedbackMetabotInputSchema } from '@src/schemas/metabot';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const feedbackMetabotDefinition: ToolDefinition<FeedbackMetabotInput> = {
  name: 'feedback_metabot',
  description: '[Requires Metabase Pro] Submit feedback for a Metabot conversation',
  inputSchema: FeedbackMetabotInputSchema,
  handler: async (client: MetabaseClient, input: FeedbackMetabotInput) => {
    const result = await client.post('/api/metabot/feedback', {
      feedback_type: input.feedback_type,
      conversation_id: input.conversation_id,
    });
    return formatToolResponse(result);
  },
};
