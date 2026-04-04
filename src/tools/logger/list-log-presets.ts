import type { MetabaseClient } from '@src/client';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const listLogPresetsDefinition: ToolDefinition = {
  name: 'list_log_presets',
  description: 'List available log level presets in Metabase',
  inputSchema: {},
  handler: async (client: MetabaseClient) => {
    const result = await client.get('/api/logger/presets');
    return formatToolResponse(result);
  },
};
