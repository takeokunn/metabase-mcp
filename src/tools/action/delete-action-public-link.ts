import type { MetabaseClient } from '@src/client';
import {
  type DeleteActionPublicLinkParams,
  DeleteActionPublicLinkParamsSchema,
} from '@src/schemas/action';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const deleteActionPublicLinkDefinition: ToolDefinition<DeleteActionPublicLinkParams> = {
  name: 'delete_action_public_link',
  description: 'Delete a public sharing link from an action in Metabase',
  inputSchema: DeleteActionPublicLinkParamsSchema,
  handler: async (client: MetabaseClient, input: DeleteActionPublicLinkParams) => {
    const result = await client.delete(`/api/action/${input.id}/public_link`);
    return formatToolResponse(result);
  },
};
