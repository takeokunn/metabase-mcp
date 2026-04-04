import type { MetabaseClient } from '@src/client';
import {
  type ExecutePreviewEmbedDashcardAction,
  ExecutePreviewEmbedDashcardActionSchema,
} from '@src/schemas/preview-embed';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const executePreviewEmbedDashcardActionDefinition: ToolDefinition<ExecutePreviewEmbedDashcardAction> =
  {
    name: 'execute_preview_embed_dashcard_action',
    description: 'Execute an action on a preview embedded dashcard in Metabase',
    inputSchema: ExecutePreviewEmbedDashcardActionSchema,
    handler: async (client: MetabaseClient, input: ExecutePreviewEmbedDashcardAction) => {
      const result = await client.post(
        `/api/preview_embed/dashboard/${input.token}/dashcard/${input.dashcard_id}/execute`,
        { parameters: input.parameters ?? {} },
      );
      return formatToolResponse(result);
    },
  };
