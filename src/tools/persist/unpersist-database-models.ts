import type { MetabaseClient } from '@src/client';
import {
  type UnpersistDatabaseModelsInput,
  UnpersistDatabaseModelsInputSchema,
} from '@src/schemas/persist';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const unpersistDatabaseModelsDefinition: ToolDefinition<UnpersistDatabaseModelsInput> = {
  name: 'unpersist_database_models',
  description: 'Unpersist all persisted models for a database in Metabase',
  inputSchema: UnpersistDatabaseModelsInputSchema,
  handler: async (client: MetabaseClient, input: UnpersistDatabaseModelsInput) => {
    const result = await client.post(`/api/persist/database/${input.id}/unpersist`, {});
    return formatToolResponse(result);
  },
};
