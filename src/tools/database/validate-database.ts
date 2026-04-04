import type { MetabaseClient } from '@src/client';
import { type ValidateDatabaseInput, ValidateDatabaseInputSchema } from '@src/schemas/database';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for validating a database connection configuration
 */
export const validateDatabaseDefinition: ToolDefinition<ValidateDatabaseInput> = {
  name: 'validate_database',
  description: 'Validate a database connection configuration before creating it in Metabase',
  inputSchema: ValidateDatabaseInputSchema,
  handler: async (client: MetabaseClient, input: ValidateDatabaseInput) => {
    const result = await client.post('/api/database/validate', {
      details: { engine: input.engine, details: input.details },
    });
    return formatToolResponse(result);
  },
};
