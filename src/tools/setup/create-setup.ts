import type { MetabaseClient } from '@src/client';
import { type CreateSetupInput, CreateSetupInputSchema } from '@src/schemas/setup';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const createSetupDefinition: ToolDefinition<CreateSetupInput> = {
  name: 'create_setup',
  description: 'Perform initial Metabase setup',
  inputSchema: CreateSetupInputSchema,
  handler: async (client: MetabaseClient, input: CreateSetupInput) => {
    const result = await client.post('/api/setup', {
      token: input.token,
      user: input.user,
      prefs: input.prefs,
      database: input.database,
    });
    return formatToolResponse(result);
  },
};
