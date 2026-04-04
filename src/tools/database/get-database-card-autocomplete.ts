import type { MetabaseClient } from '@src/client';
import { type GetDatabaseCardAutocompleteParams, GetDatabaseCardAutocompleteParamsSchema } from '@src/schemas/database';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const getDatabaseCardAutocompleteDefinition: ToolDefinition<GetDatabaseCardAutocompleteParams> = {
  name: 'get_database_card_autocomplete',
  description: 'Get card autocomplete suggestions for a database in Metabase',
  inputSchema: GetDatabaseCardAutocompleteParamsSchema,
  handler: async (client: MetabaseClient, input: GetDatabaseCardAutocompleteParams) => {
    const result = await client.get(`/api/database/${input.id}/card_autocomplete_suggestions`, { query: input.query });
    return formatToolResponse(result);
  },
};
