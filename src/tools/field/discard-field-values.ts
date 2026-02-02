import type { MetabaseClient } from '@src/client';
import { type DiscardFieldValuesInput, DiscardFieldValuesInputSchema } from '@src/schemas/field';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for discarding cached field values
 */
export const discardFieldValuesDefinition: ToolDefinition<DiscardFieldValuesInput> = {
  name: 'discard_field_values',
  description: 'Discard the cached values for a field in Metabase',
  inputSchema: DiscardFieldValuesInputSchema,
  handler: async (client: MetabaseClient, input: DiscardFieldValuesInput) => {
    const result = await client.post(`/api/field/${input.id}/discard_values`);
    return formatToolResponse(result);
  },
};
