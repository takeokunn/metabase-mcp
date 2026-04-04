import type { MetabaseClient } from '@src/client';
import { type GetTaskParams, GetTaskParamsSchema } from '@src/schemas/task';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const getTaskDefinition: ToolDefinition<GetTaskParams> = {
  name: 'get_task',
  description: 'Get a single scheduled task by ID from Metabase',
  inputSchema: GetTaskParamsSchema,
  handler: async (client: MetabaseClient, input: GetTaskParams) => {
    const result = await client.get(`/api/task/${input.id}`);
    return formatToolResponse(result);
  },
};
