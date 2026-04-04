import type { MetabaseClient } from '@src/client';
import {
  type ExecuteDashcardActionInput,
  ExecuteDashcardActionInputSchema,
} from '@src/schemas/dashboard';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const executeDashcardActionDefinition: ToolDefinition<ExecuteDashcardActionInput> = {
  name: 'execute_dashcard_action',
  description: 'Execute an action on a dashcard in Metabase',
  inputSchema: ExecuteDashcardActionInputSchema,
  handler: async (client: MetabaseClient, input: ExecuteDashcardActionInput) => {
    const result = await client.post(
      `/api/dashboard/${input.dashboard_id}/dashcard/${input.dashcard_id}/execute`,
      { parameters: input.parameters },
    );
    return formatToolResponse(result);
  },
};
