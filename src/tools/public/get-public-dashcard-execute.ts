import type { MetabaseClient } from '@src/client';
import { type GetPublicDashcardExecute, GetPublicDashcardExecuteSchema } from '@src/schemas/public';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for fetching the values used to execute an action on a public dashcard.
 *
 * Metabase expects the `parameters` map to be passed as a JSON-encoded query string.
 */
export const getPublicDashcardExecuteDefinition: ToolDefinition<GetPublicDashcardExecute> = {
  name: 'get_public_dashcard_execute',
  description: 'Fetch the values for executing an action on a public dashcard in Metabase',
  inputSchema: GetPublicDashcardExecuteSchema,
  handler: async (client: MetabaseClient, input: GetPublicDashcardExecute) => {
    const result = await client.get(
      `/api/public/dashboard/${input.uuid}/dashcard/${input.dashcard_id}/execute`,
      { parameters: JSON.stringify(input.parameters) },
    );
    return formatToolResponse(result);
  },
};
