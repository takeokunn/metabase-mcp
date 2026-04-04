import type { MetabaseClient } from '@src/client';
import { type ExportDashcardQueryInput, ExportDashcardQueryInputSchema } from '@src/schemas/dashboard';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const exportDashcardQueryDefinition: ToolDefinition<ExportDashcardQueryInput> = {
  name: 'export_dashcard_query',
  description: 'Export query results for a dashcard in Metabase',
  inputSchema: ExportDashcardQueryInputSchema,
  handler: async (client: MetabaseClient, input: ExportDashcardQueryInput) => {
    const result = await client.post(`/api/dashboard/${input.dashboard_id}/dashcard/${input.dashcard_id}/card/${input.card_id}/query/${input.export_format}`, { parameters: input.parameters ?? [] });
    return formatToolResponse(result);
  },
};
