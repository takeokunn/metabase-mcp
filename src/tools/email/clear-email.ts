import type { MetabaseClient } from '@src/client';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for clearing the SMTP email configuration in Metabase
 */
export const clearEmailDefinition: ToolDefinition = {
  name: 'clear_email',
  description: 'Clear the SMTP email configuration in Metabase',
  inputSchema: {},
  handler: async (client: MetabaseClient) => {
    const result = await client.delete('/api/email');
    return formatToolResponse(result);
  },
};
