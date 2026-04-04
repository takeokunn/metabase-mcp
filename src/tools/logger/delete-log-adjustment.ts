import type { MetabaseClient } from '@src/client';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const deleteLogAdjustmentDefinition: ToolDefinition = {
  name: 'delete_log_adjustment',
  description: 'Remove all temporary log level adjustments in Metabase',
  inputSchema: {},
  handler: async (client: MetabaseClient) => {
    const result = await client.delete('/api/logger/adjustment');
    return formatToolResponse(result);
  },
};
