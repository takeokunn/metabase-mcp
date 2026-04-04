import type { MetabaseClient } from '@src/client';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const listUniqueTasksDefinition: ToolDefinition = {
  name: 'list_unique_tasks',
  description: 'List unique tasks in Metabase',
  inputSchema: {},
  handler: async (client: MetabaseClient) => {
    const result = await client.get('/api/task/unique-tasks');
    return formatToolResponse(result);
  },
};
