import type { MetabaseClient } from '@src/client';
import { type GetTaskRunParams, GetTaskRunParamsSchema } from '@src/schemas/task';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const getTaskRunDefinition: ToolDefinition<GetTaskRunParams> = {
  name: 'get_task_run',
  description: 'Get a single task run by ID from Metabase',
  inputSchema: GetTaskRunParamsSchema,
  handler: async (client: MetabaseClient, input: GetTaskRunParams) => {
    const result = await client.get(`/api/task/runs/${input.id}`);
    return formatToolResponse(result);
  },
};
