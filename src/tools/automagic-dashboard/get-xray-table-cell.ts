import type { MetabaseClient } from '@src/client';
import { type GetXrayTableCellParams, GetXrayTableCellParamsSchema } from '@src/schemas/automagic-dashboard';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const getXrayTableCellDefinition: ToolDefinition<GetXrayTableCellParams> = {
  name: 'get_xray_table_cell',
  description: 'Get an auto-generated X-ray dashboard for a specific table cell in Metabase',
  inputSchema: GetXrayTableCellParamsSchema,
  handler: async (client: MetabaseClient, input: GetXrayTableCellParams) => {
    const result = await client.get(
      `/api/automagic-dashboards/table/${input.id}/cell/${input.row_value}/rule/${input.prefix}/${input.rule}`,
    );
    return formatToolResponse(result);
  },
};
