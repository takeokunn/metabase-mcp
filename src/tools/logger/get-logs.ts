import type { MetabaseClient } from '@src/client';
import { type GetLogsParams, GetLogsParamsSchema } from '@src/schemas/logger';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const getLogsDefinition: ToolDefinition<GetLogsParams> = {
  name: 'get_logs',
  description: 'Retrieve application logs from Metabase with optional level/namespace filters',
  inputSchema: GetLogsParamsSchema,
  handler: async (client: MetabaseClient, input: GetLogsParams) => {
    const params: Record<string, unknown> = {};
    if (input.level !== undefined) params.level = input.level;
    if (input.namespace !== undefined) params.namespace = input.namespace;
    if (input.last_n_lines !== undefined) params.last_n_lines = input.last_n_lines;
    const result = await client.get(
      '/api/logger/logs',
      Object.keys(params).length > 0 ? params : undefined,
    );
    return formatToolResponse(result);
  },
};
