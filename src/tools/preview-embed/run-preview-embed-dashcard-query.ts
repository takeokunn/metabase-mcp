import type { MetabaseClient } from '@src/client';
import {
  type RunPreviewEmbedDashcardQuery,
  RunPreviewEmbedDashcardQuerySchema,
} from '@src/schemas/preview-embed';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const runPreviewEmbedDashcardQueryDefinition: ToolDefinition<RunPreviewEmbedDashcardQuery> =
  {
    name: 'run_preview_embed_dashcard_query',
    description: 'Run a query for a preview embedded dashcard in Metabase',
    inputSchema: RunPreviewEmbedDashcardQuerySchema,
    handler: async (client: MetabaseClient, input: RunPreviewEmbedDashcardQuery) => {
      const result = await client.get(
        `/api/preview_embed/dashboard/${input.token}/dashcard/${input.dashcard_id}/card/${input.card_id}`,
      );
      return formatToolResponse(result);
    },
  };
