import type { MetabaseClient } from '@src/client';
import { type TestChannelInput, TestChannelInputSchema } from '@src/schemas/channel';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for testing a notification channel configuration
 */
export const testChannelDefinition: ToolDefinition<TestChannelInput> = {
  name: 'test_channel',
  description: 'Test a notification channel configuration in Metabase',
  inputSchema: TestChannelInputSchema,
  handler: async (client: MetabaseClient, input: TestChannelInput) => {
    const result = await client.post('/api/channel/test', input);
    return formatToolResponse(result);
  },
};
