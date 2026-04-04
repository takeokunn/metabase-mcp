import type { MetabaseClient } from '@src/client';
import { type PersistDatabaseModelsParams, PersistDatabaseModelsParamsSchema } from '@src/schemas/persist';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for persisting all models in a database
 */
export const persistDatabaseModelsDefinition: ToolDefinition<PersistDatabaseModelsParams> = {
  name: 'persist_database_models',
  description: 'Enable persistence for all models in a database in Metabase',
  inputSchema: PersistDatabaseModelsParamsSchema,
  handler: async (client: MetabaseClient, input: PersistDatabaseModelsParams) => {
    const result = await client.post(`/api/persist/database/${input.db_id}/persist`);
    return formatToolResponse(result);
  },
};
