import type { MetabaseClient } from '@src/client';
import {
  type ExportDashboardCardQueryInput,
  ExportDashboardCardQueryInputSchema,
} from '@src/schemas/dashboard';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for exporting a dashcard query result in a specified format in Metabase
 */
export const exportDashboardCardQueryDefinition: ToolDefinition<ExportDashboardCardQueryInput> = {
  name: 'export_dashboard_card_query',
  description:
    'Export a dashcard query result in a specified format (csv, json, xlsx, pdf) in Metabase',
  inputSchema: ExportDashboardCardQueryInputSchema,
  handler: async (client: MetabaseClient, input: ExportDashboardCardQueryInput) => {
    const result = await client.post(
      `/api/dashboard/${input.id}/dashcard/${input.dashcard_id}/card/${input.card_id}/query/${input.export_format}`,
      { parameters: input.parameters ?? [] },
    );
    return formatToolResponse(result);
  },
};
