import type { MetabaseClient } from '@src/client';
import {
  type ExecuteEmbedDashcardAction,
  ExecuteEmbedDashcardActionSchema,
} from '@src/schemas/embed';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const executeEmbedDashcardActionDefinition: ToolDefinition<ExecuteEmbedDashcardAction> = {
  name: 'execute_embed_dashcard_action',
  description: 'Execute an action on an embedded dashcard in Metabase',
  inputSchema: ExecuteEmbedDashcardActionSchema,
  handler: async (client: MetabaseClient, input: ExecuteEmbedDashcardAction) => {
    const result = await client.post(
      `/api/embed/dashboard/${input.token}/dashcard/${input.dashcard_id}/execute`,
      { parameters: input.parameters ?? {} },
    );
    return formatToolResponse(result);
  },
};
