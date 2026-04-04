import type { MetabaseClient } from '@src/client';
import { type CreateLogAdjustmentInput, CreateLogAdjustmentInputSchema } from '@src/schemas/logger';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const createLogAdjustmentDefinition: ToolDefinition<CreateLogAdjustmentInput> = {
  name: 'create_log_adjustment',
  description: 'Temporarily adjust the log level for a specific logger namespace in Metabase',
  inputSchema: CreateLogAdjustmentInputSchema,
  handler: async (client: MetabaseClient, input: CreateLogAdjustmentInput) => {
    const result = await client.post('/api/logger/adjustment', {
      logger: input.logger,
      level: input.level,
      duration_ms: input.duration_ms,
    });
    return formatToolResponse(result);
  },
};
