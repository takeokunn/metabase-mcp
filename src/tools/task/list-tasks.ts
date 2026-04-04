import type { MetabaseClient } from '@src/client';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const listTasksDefinition: ToolDefinition = {
  name: 'list_tasks',
  description: 'List all scheduled tasks in Metabase',
  inputSchema: {},
  handler: async (client: MetabaseClient) => {
    const result = await client.get('/api/task');
    return formatToolResponse(result);
  },
};
