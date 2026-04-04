import type { MetabaseClient } from '@src/client';
import {
  type SubmitProductFeedbackInput,
  SubmitProductFeedbackInputSchema,
} from '@src/schemas/product-feedback';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const submitProductFeedbackDefinition: ToolDefinition<SubmitProductFeedbackInput> = {
  name: 'submit_product_feedback',
  description: 'Submit product feedback to Metabase',
  inputSchema: SubmitProductFeedbackInputSchema,
  handler: async (client: MetabaseClient, input: SubmitProductFeedbackInput) => {
    const result = await client.post('/api/product-feedback', {
      source: input.source,
      comment: input.comment,
    });
    return formatToolResponse(result);
  },
};
