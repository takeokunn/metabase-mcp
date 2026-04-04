import type { MetabaseClient } from '@src/client';
import {
  type RunPreviewEmbedCardPivotQuery,
  RunPreviewEmbedCardPivotQuerySchema,
} from '@src/schemas/preview-embed';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const runPreviewEmbedCardPivotQueryDefinition: ToolDefinition<RunPreviewEmbedCardPivotQuery> =
  {
    name: 'run_preview_embed_card_pivot_query',
    description: 'Run a pivot query for a preview embedded card in Metabase',
    inputSchema: RunPreviewEmbedCardPivotQuerySchema,
    handler: async (client: MetabaseClient, input: RunPreviewEmbedCardPivotQuery) => {
      const result = await client.get(`/api/preview_embed/pivot/card/${input.token}/query`);
      return formatToolResponse(result);
    },
  };
