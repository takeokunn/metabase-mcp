import type { MetabaseClient } from '@src/client';
import { type DeleteDashboardInput, DeleteDashboardInputSchema } from '@src/schemas/dashboard';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for deleting a dashboard from Metabase
 */
export const deleteDashboardDefinition: ToolDefinition<DeleteDashboardInput> = {
  name: 'delete_dashboard',
  description: 'Delete a dashboard from Metabase',
  inputSchema: DeleteDashboardInputSchema,
  handler: async (client: MetabaseClient, input: DeleteDashboardInput) => {
    const result = await client.delete(`/api/dashboard/${input.id}`);
    return formatToolResponse(result);
  },
};
