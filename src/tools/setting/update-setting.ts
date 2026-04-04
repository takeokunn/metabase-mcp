import type { MetabaseClient } from '@src/client';
import { type UpdateSettingInput, UpdateSettingInputSchema } from '@src/schemas/setting';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for updating a single Metabase setting by key
 */
export const updateSettingDefinition: ToolDefinition<UpdateSettingInput> = {
  name: 'update_setting',
  description: 'Update the value of a single Metabase setting by key',
  inputSchema: UpdateSettingInputSchema,
  handler: async (client: MetabaseClient, input: UpdateSettingInput) => {
    const result = await client.put(`/api/setting/${encodeURIComponent(input.key)}`, { value: input.value });
    return formatToolResponse(result);
  },
};
