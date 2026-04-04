import type { MetabaseClient } from '@src/client';
import { type GetVirtualDatabaseDatasetsParams, GetVirtualDatabaseDatasetsParamsSchema } from '@src/schemas/database';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const getVirtualDatabaseDatasetsDefinition: ToolDefinition<GetVirtualDatabaseDatasetsParams> = {
  name: 'get_virtual_database_datasets',
  description: 'Get datasets for a virtual database in Metabase',
  inputSchema: GetVirtualDatabaseDatasetsParamsSchema,
  handler: async (client: MetabaseClient, input: GetVirtualDatabaseDatasetsParams) => {
    const result = await client.get(`/api/database/${input.virtual_db}/datasets`);
    return formatToolResponse(result);
  },
};
