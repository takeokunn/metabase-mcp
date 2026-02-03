import type { MetabaseClient } from '@src/client';
import {
  type CreateDashboardPublicLinkInput,
  CreateDashboardPublicLinkInputSchema,
} from '@src/schemas/dashboard';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for creating a public sharing link for a dashboard in Metabase
 */
export const createDashboardPublicLinkDefinition: ToolDefinition<CreateDashboardPublicLinkInput> = {
  name: 'create_dashboard_public_link',
  description: 'Create a public sharing link for a dashboard in Metabase (returns UUID)',
  inputSchema: CreateDashboardPublicLinkInputSchema,
  handler: async (client: MetabaseClient, input: CreateDashboardPublicLinkInput) => {
    const { dashboard_id } = input;
    const result = await client.post(`/api/dashboard/${dashboard_id}/public_link`, {});
    return formatToolResponse(result);
  },
};
