import type { MetabaseClient } from '@src/client';
import { type GenerateRandomTokenInput, GenerateRandomTokenInputSchema } from '@src/schemas/util';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const generateRandomTokenDefinition: ToolDefinition<GenerateRandomTokenInput> = {
  name: 'generate_random_token',
  description: 'Generate a random token in Metabase',
  inputSchema: GenerateRandomTokenInputSchema,
  handler: async (client: MetabaseClient, _input: GenerateRandomTokenInput) => {
    const result = await client.get('/api/util/random_token');
    return formatToolResponse(result);
  },
};
