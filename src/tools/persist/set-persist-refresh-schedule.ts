import type { MetabaseClient } from '@src/client';
import {
  type SetPersistRefreshScheduleInput,
  SetPersistRefreshScheduleInputSchema,
} from '@src/schemas/persist';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for setting the refresh schedule for persisted models
 */
export const setPersistRefreshScheduleDefinition: ToolDefinition<SetPersistRefreshScheduleInput> = {
  name: 'set_persist_refresh_schedule',
  description: 'Set the refresh schedule for persisted models in Metabase',
  inputSchema: SetPersistRefreshScheduleInputSchema,
  handler: async (client: MetabaseClient, input: SetPersistRefreshScheduleInput) => {
    const result = await client.post('/api/persist/set-refresh-schedule', {
      schedule: input.schedule,
    });
    return formatToolResponse(result);
  },
};
