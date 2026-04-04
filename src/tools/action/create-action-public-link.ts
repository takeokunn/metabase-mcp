import type { MetabaseClient } from '@src/client';
import {
  type CreateActionPublicLinkParams,
  CreateActionPublicLinkParamsSchema,
} from '@src/schemas/action';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const createActionPublicLinkDefinition: ToolDefinition<CreateActionPublicLinkParams> = {
  name: 'create_action_public_link',
  description: 'Create a public sharing link for an action in Metabase (returns UUID)',
  inputSchema: CreateActionPublicLinkParamsSchema,
  handler: async (client: MetabaseClient, input: CreateActionPublicLinkParams) => {
    const result = await client.post(`/api/action/${input.id}/public_link`, {});
    return formatToolResponse(result);
  },
};
