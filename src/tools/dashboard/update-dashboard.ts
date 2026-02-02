import type { MetabaseClient } from '@src/client';
import { type UpdateDashboardInput, UpdateDashboardInputSchema } from '@src/schemas/dashboard';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for updating an existing dashboard in Metabase
 */
export const updateDashboardDefinition: ToolDefinition<UpdateDashboardInput> = {
  name: 'update_dashboard',
  description: 'Update an existing dashboard in Metabase',
  inputSchema: UpdateDashboardInputSchema,
  handler: async (client: MetabaseClient, input: UpdateDashboardInput) => {
    const { id, ...updateData } = input;
    const result = await client.put(`/api/dashboard/${id}`, updateData);
    return formatToolResponse(result);
  },
};
