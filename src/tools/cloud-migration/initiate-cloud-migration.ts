import type { MetabaseClient } from '@src/client';
import { type InitiateCloudMigrationInput, InitiateCloudMigrationInputSchema } from '@src/schemas/cloud-migration';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const initiateCloudMigrationDefinition: ToolDefinition<InitiateCloudMigrationInput> = {
  name: 'initiate_cloud_migration',
  description: 'Initiate a cloud migration to Metabase Cloud',
  inputSchema: InitiateCloudMigrationInputSchema,
  handler: async (client: MetabaseClient, input: InitiateCloudMigrationInput) => {
    const result = await client.post('/api/cloud-migration', {
      store_api_key: input.store_api_key,
    });
    return formatToolResponse(result);
  },
};
