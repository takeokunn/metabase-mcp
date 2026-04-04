import type { MetabaseClient } from '@src/client';
import {
  type RunPublicCardPivotQuery,
  RunPublicCardPivotQuerySchema,
} from '@src/schemas/public';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const runPublicCardPivotQueryDefinition: ToolDefinition<RunPublicCardPivotQuery> = {
  name: 'run_public_card_pivot_query',
  description: 'Run a pivot query for a public card in Metabase',
  inputSchema: RunPublicCardPivotQuerySchema,
  handler: async (client: MetabaseClient, input: RunPublicCardPivotQuery) => {
    const result = await client.get(`/api/public/pivot/card/${input.uuid}/query`, {
      parameters: input.parameters ?? [],
    });
    return formatToolResponse(result);
  },
};
