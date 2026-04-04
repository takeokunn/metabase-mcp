import type { MetabaseClient } from '@src/client';
import { type GetPublicDashcardQuery, GetPublicDashcardQuerySchema } from '@src/schemas/public';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const getPublicDashcardQueryDefinition: ToolDefinition<GetPublicDashcardQuery> = {
  name: 'get_public_dashcard_query',
  description: 'Get query results for a public dashcard in Metabase',
  inputSchema: GetPublicDashcardQuerySchema,
  handler: async (client: MetabaseClient, input: GetPublicDashcardQuery) => {
    const result = await client.get(
      `/api/public/dashboard/${input.uuid}/dashcard/${input.dashcard_id}/card/${input.card_id}/query`,
    );
    return formatToolResponse(result);
  },
};
