import type { MetabaseClient } from '@src/client';
import { type CreateDashboardInput, CreateDashboardInputSchema } from '@src/schemas/dashboard';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for creating a new dashboard in Metabase
 */
export const createDashboardDefinition: ToolDefinition<CreateDashboardInput> = {
  name: 'create_dashboard',
  description: 'Create a new dashboard in Metabase',
  inputSchema: CreateDashboardInputSchema,
  handler: async (client: MetabaseClient, input: CreateDashboardInput) => {
    const result = await client.post('/api/dashboard', {
      name: input.name,
      description: input.description,
      collection_id: input.collection_id,
      parameters: input.parameters ?? [],
    });
    return formatToolResponse(result);
  },
};
