import type { MetabaseClient } from '@src/client';
import { type GetDatabaseAutocompleteParams, GetDatabaseAutocompleteParamsSchema } from '@src/schemas/database';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for getting autocomplete suggestions from a database
 */
export const getDatabaseAutocompleteDefinition: ToolDefinition<GetDatabaseAutocompleteParams> = {
  name: 'get_database_autocomplete',
  description: 'Get autocomplete suggestions for a database in Metabase',
  inputSchema: GetDatabaseAutocompleteParamsSchema,
  handler: async (client: MetabaseClient, input: GetDatabaseAutocompleteParams) => {
    const result = await client.get(`/api/database/${input.id}/autocomplete_suggestions`, {
      prefix: input.prefix,
      substring: input.substring,
    });
    return formatToolResponse(result);
  },
};
