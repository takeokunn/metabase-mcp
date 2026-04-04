import type { MetabaseClient } from '@src/client';
import {
  type UpdateTableFieldsOrderInput,
  UpdateTableFieldsOrderInputSchema,
} from '@src/schemas/table';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for reordering fields in a table in Metabase
 */
export const updateTableFieldsOrderDefinition: ToolDefinition<UpdateTableFieldsOrderInput> = {
  name: 'update_table_fields_order',
  description: 'Reorder fields in a table in Metabase',
  inputSchema: UpdateTableFieldsOrderInputSchema,
  handler: async (client: MetabaseClient, input: UpdateTableFieldsOrderInput) => {
    const result = await client.put(`/api/table/${input.id}/fields/order`, input.field_order);
    return formatToolResponse(result);
  },
};
