import type { MetabaseClient } from '@src/client';
import {
  type ExecutePublicDashcardAction,
  ExecutePublicDashcardActionSchema,
} from '@src/schemas/public';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const executePublicDashcardActionDefinition: ToolDefinition<ExecutePublicDashcardAction> = {
  name: 'execute_public_dashcard_action',
  description: 'Execute an action on a public dashcard in Metabase',
  inputSchema: ExecutePublicDashcardActionSchema,
  handler: async (client: MetabaseClient, input: ExecutePublicDashcardAction) => {
    const result = await client.post(
      `/api/public/dashboard/${input.uuid}/dashcard/${input.dashcard_id}/execute`,
      { parameters: input.parameters ?? {} },
    );
    return formatToolResponse(result);
  },
};
