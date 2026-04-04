import type { MetabaseClient } from '@src/client';
import { type TestEmailInput, TestEmailInputSchema } from '@src/schemas/email';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for sending a test email in Metabase
 */
export const testEmailDefinition: ToolDefinition<TestEmailInput> = {
  name: 'test_email',
  description: 'Send a test email to verify SMTP configuration in Metabase',
  inputSchema: TestEmailInputSchema,
  handler: async (client: MetabaseClient, input: TestEmailInput) => {
    const result = await client.post('/api/email/test', input);
    return formatToolResponse(result);
  },
};
