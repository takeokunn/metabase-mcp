import type { MetabaseClient } from '@src/client';
import { type TestPulseInput, TestPulseInputSchema } from '@src/schemas/pulse';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const testPulseDefinition: ToolDefinition<TestPulseInput> = {
  name: 'test_pulse',
  description: 'Test a pulse by sending it immediately in Metabase',
  inputSchema: TestPulseInputSchema,
  handler: async (client: MetabaseClient, input: TestPulseInput) => {
    const result = await client.post('/api/pulse/test', input.pulse);
    return formatToolResponse(result);
  },
};
