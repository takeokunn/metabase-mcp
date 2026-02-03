import type { MetabaseClient } from '@src/client';
import { type UpdateAlertInput, UpdateAlertInputSchema } from '@src/schemas/alert';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for updating an existing alert in Metabase
 */
export const updateAlertDefinition: ToolDefinition<UpdateAlertInput> = {
  name: 'update_alert',
  description: 'Update an existing alert in Metabase',
  inputSchema: UpdateAlertInputSchema,
  handler: async (client: MetabaseClient, input: UpdateAlertInput) => {
    const { id, ...updateData } = input;
    const result = await client.put(`/api/alert/${id}`, updateData);
    return formatToolResponse(result);
  },
};
