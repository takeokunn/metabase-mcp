import type { MetabaseClient } from '@src/client';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const getTaskInfoDefinition: ToolDefinition = {
  name: 'get_task_info',
  description: 'Get task info and scheduler details from Metabase',
  inputSchema: {},
  handler: async (client: MetabaseClient) => {
    const result = await client.get('/api/task/info');
    return formatToolResponse(result);
  },
};
