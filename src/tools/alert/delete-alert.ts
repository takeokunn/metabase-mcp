import type { MetabaseClient } from '@src/client';
import { type DeleteAlertInput, DeleteAlertInputSchema } from '@src/schemas/alert';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for deleting an alert from Metabase
 */
export const deleteAlertDefinition: ToolDefinition<DeleteAlertInput> = {
  name: 'delete_alert',
  description: 'Delete an alert from Metabase',
  inputSchema: DeleteAlertInputSchema,
  handler: async (client: MetabaseClient, input: DeleteAlertInput) => {
    const result = await client.delete(`/api/alert/${input.id}`);
    return formatToolResponse(result);
  },
};
