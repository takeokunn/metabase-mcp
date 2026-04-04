import type { MetabaseClient } from '@src/client';
import { type GetDatabaseParams, GetDatabaseParamsSchema } from '@src/schemas/database';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for listing cards (questions) that use a given database
 */
export const listDatabaseConnectedCardsDefinition: ToolDefinition<GetDatabaseParams> = {
  name: 'list_database_connected_cards',
  description: 'List all cards (questions) that are connected to a database in Metabase',
  inputSchema: GetDatabaseParamsSchema,
  handler: async (client: MetabaseClient, input: GetDatabaseParams) => {
    const result = await client.get(`/api/database/${input.id}/questions`);
    return formatToolResponse(result);
  },
};
