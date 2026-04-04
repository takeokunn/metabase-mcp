import type { MetabaseClient } from '@src/client';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for disabling model persistence globally
 */
export const disableModelPersistenceDefinition: ToolDefinition = {
  name: 'disable_model_persistence',
  description: 'Disable model persistence globally in Metabase',
  inputSchema: {},
  handler: async (client: MetabaseClient) => {
    const result = await client.post('/api/persist/disable');
    return formatToolResponse(result);
  },
};
