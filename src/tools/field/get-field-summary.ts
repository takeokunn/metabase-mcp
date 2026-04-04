import type { MetabaseClient } from '@src/client';
import { type GetFieldSummaryInput, GetFieldSummaryInputSchema } from '@src/schemas/field';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const getFieldSummaryDefinition: ToolDefinition<GetFieldSummaryInput> = {
  name: 'get_field_summary',
  description: 'Get summary statistics for a field in Metabase',
  inputSchema: GetFieldSummaryInputSchema,
  handler: async (client: MetabaseClient, input: GetFieldSummaryInput) => {
    const result = await client.get(`/api/field/${input.id}/summary`);
    return formatToolResponse(result);
  },
};
