import type { MetabaseClient } from '@src/client';
import {
  type DeleteDashboardPublicLinkInput,
  DeleteDashboardPublicLinkInputSchema,
} from '@src/schemas/dashboard';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for deleting a public sharing link from a dashboard in Metabase
 */
export const deleteDashboardPublicLinkDefinition: ToolDefinition<DeleteDashboardPublicLinkInput> = {
  name: 'delete_dashboard_public_link',
  description: 'Delete a public sharing link from a dashboard in Metabase',
  inputSchema: DeleteDashboardPublicLinkInputSchema,
  handler: async (client: MetabaseClient, input: DeleteDashboardPublicLinkInput) => {
    const { dashboard_id } = input;
    const result = await client.delete(`/api/dashboard/${dashboard_id}/public_link`);
    return formatToolResponse(result);
  },
};
