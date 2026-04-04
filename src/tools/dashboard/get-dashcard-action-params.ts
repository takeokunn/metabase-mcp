import type { MetabaseClient } from '@src/client';
import {
  type GetDashcardActionParamsInput,
  GetDashcardActionParamsInputSchema,
} from '@src/schemas/dashboard';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const getDashcardActionParamsDefinition: ToolDefinition<GetDashcardActionParamsInput> = {
  name: 'get_dashcard_action_params',
  description: 'Get action parameters for a dashcard in Metabase',
  inputSchema: GetDashcardActionParamsInputSchema,
  handler: async (client: MetabaseClient, input: GetDashcardActionParamsInput) => {
    const result = await client.get(
      `/api/dashboard/${input.dashboard_id}/dashcard/${input.dashcard_id}/execute`,
      input.parameters,
    );
    return formatToolResponse(result);
  },
};
