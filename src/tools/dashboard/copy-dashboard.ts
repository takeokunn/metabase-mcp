import type { MetabaseClient } from '@src/client';
import { type CopyDashboardInput, CopyDashboardInputSchema } from '@src/schemas/dashboard';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for copying a dashboard in Metabase
 */
export const copyDashboardDefinition: ToolDefinition<CopyDashboardInput> = {
  name: 'copy_dashboard',
  description: 'Copy an existing dashboard in Metabase',
  inputSchema: CopyDashboardInputSchema,
  handler: async (client: MetabaseClient, input: CopyDashboardInput) => {
    const { id, ...copyData } = input;
    const result = await client.post(`/api/dashboard/${id}/copy`, copyData);
    return formatToolResponse(result);
  },
};
