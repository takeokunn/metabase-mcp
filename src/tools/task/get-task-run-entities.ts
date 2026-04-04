import type { MetabaseClient } from '@src/client';
import { type GetTaskRunEntitiesInput, GetTaskRunEntitiesInputSchema } from '@src/schemas/task';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const getTaskRunEntitiesDefinition: ToolDefinition<GetTaskRunEntitiesInput> = {
  name: 'get_task_run_entities',
  description: 'Get entity types tracked by task runs in Metabase',
  inputSchema: GetTaskRunEntitiesInputSchema,
  handler: async (client: MetabaseClient, _input: GetTaskRunEntitiesInput) => {
    const result = await client.get('/api/task/runs/entities');
    return formatToolResponse(result);
  },
};
