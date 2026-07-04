import type { MetabaseClient } from '@src/client';
import { type GetFieldTableIdsInput, GetFieldTableIdsInputSchema } from '@src/schemas/field';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for resolving unique Table IDs for a list of Field IDs in Metabase
 */
export const getFieldTableIdsDefinition: ToolDefinition<GetFieldTableIdsInput> = {
  name: 'get_field_table_ids',
  description: 'Get unique Table IDs for a list of Field IDs in Metabase',
  inputSchema: GetFieldTableIdsInputSchema,
  handler: async (client: MetabaseClient, input: GetFieldTableIdsInput) => {
    const result = await client.post('/api/field/table-ids', {
      field_ids: input.field_ids,
    });
    return formatToolResponse(result);
  },
};
