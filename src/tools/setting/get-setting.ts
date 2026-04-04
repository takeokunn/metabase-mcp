import type { MetabaseClient } from '@src/client';
import { type GetSettingParams, GetSettingParamsSchema } from '@src/schemas/setting';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for getting a single Metabase setting by key
 */
export const getSettingDefinition: ToolDefinition<GetSettingParams> = {
  name: 'get_setting',
  description: 'Get the value of a single Metabase setting by key',
  inputSchema: GetSettingParamsSchema,
  handler: async (client: MetabaseClient, input: GetSettingParams) => {
    const result = await client.get(`/api/setting/${encodeURIComponent(input.key)}`);
    return formatToolResponse(result);
  },
};
