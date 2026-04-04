import type { MetabaseClient } from '@src/client';
import { type ConfigureEmailInput, ConfigureEmailInputSchema } from '@src/schemas/email';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for configuring SMTP email settings in Metabase
 */
export const configureEmailDefinition: ToolDefinition<ConfigureEmailInput> = {
  name: 'configure_email',
  description: 'Configure SMTP email settings in Metabase',
  inputSchema: ConfigureEmailInputSchema,
  handler: async (client: MetabaseClient, input: ConfigureEmailInput) => {
    const result = await client.put('/api/email', input);
    return formatToolResponse(result);
  },
};
