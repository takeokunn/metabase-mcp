import type { MetabaseClient } from '@src/client';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const listTaskRunsDefinition: ToolDefinition = {
  name: 'list_task_runs',
  description: 'List recent task runs in Metabase',
  inputSchema: {},
  handler: async (client: MetabaseClient) => {
    const result = await client.get('/api/task/runs');
    return formatToolResponse(result);
  },
};
