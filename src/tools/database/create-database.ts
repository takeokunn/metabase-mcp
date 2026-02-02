import type { MetabaseClient } from '@src/client';
import { type CreateDatabaseInput, CreateDatabaseInputSchema } from '@src/schemas/database';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for creating a new database connection in Metabase
 */
export const createDatabaseDefinition: ToolDefinition<CreateDatabaseInput> = {
  name: 'create_database',
  description: 'Add a new database connection to Metabase',
  inputSchema: CreateDatabaseInputSchema,
  handler: async (client: MetabaseClient, input: CreateDatabaseInput) => {
    const result = await client.post('/api/database', {
      name: input.name,
      engine: input.engine,
      details: input.details ?? {},
    });
    return formatToolResponse(result);
  },
};
