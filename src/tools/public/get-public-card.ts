import type { MetabaseClient } from '@src/client';
import { type GetPublicCardParams, GetPublicCardParamsSchema } from '@src/schemas/public';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const getPublicCardDefinition: ToolDefinition<GetPublicCardParams> = {
  name: 'get_public_card',
  description: 'Get a publicly shared card by UUID from Metabase',
  inputSchema: GetPublicCardParamsSchema,
  handler: async (client: MetabaseClient, input: GetPublicCardParams) => {
    const result = await client.get(`/api/public/card/${input.uuid}`);
    return formatToolResponse(result);
  },
};
