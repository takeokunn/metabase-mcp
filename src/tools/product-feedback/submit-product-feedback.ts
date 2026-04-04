import type { MetabaseClient } from '@src/client';
import {
  type SubmitProductFeedbackInput,
  SubmitProductFeedbackInputSchema,
} from '@src/schemas/product-feedback';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for submitting product feedback to Metabase
 */
export const submitProductFeedbackDefinition: ToolDefinition<SubmitProductFeedbackInput> = {
  name: 'submit_product_feedback',
  description:
    'Submit product feedback to Metabase from a user. Includes comments, the source context, and an optional rating.',
  inputSchema: SubmitProductFeedbackInputSchema,
  handler: async (client: MetabaseClient, input: SubmitProductFeedbackInput) => {
    const result = await client.post('/api/product-feedback', {
      comments: input.comments,
      source: input.source,
      rating: input.rating,
    });
    return formatToolResponse(result);
  },
};
