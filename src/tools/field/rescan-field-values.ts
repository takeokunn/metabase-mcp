import type { MetabaseClient } from '@src/client';
import { type RescanFieldValuesInput, RescanFieldValuesInputSchema } from '@src/schemas/field';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for rescanning and caching field values
 */
export const rescanFieldValuesDefinition: ToolDefinition<RescanFieldValuesInput> = {
  name: 'rescan_field_values',
  description: 'Trigger a rescan of the cached values for a field in Metabase',
  inputSchema: RescanFieldValuesInputSchema,
  handler: async (client: MetabaseClient, input: RescanFieldValuesInput) => {
    const result = await client.post(`/api/field/${input.id}/rescan_values`);
    return formatToolResponse(result);
  },
};
