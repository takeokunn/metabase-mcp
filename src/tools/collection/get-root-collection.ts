import type { MetabaseClient } from '@src/client';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';
import { z } from 'zod';

const GetRootCollectionParamsSchema = z.object({});
type GetRootCollectionParams = z.infer<typeof GetRootCollectionParamsSchema>;

/**
 * Tool definition for getting the root collection
 */
export const getRootCollectionDefinition: ToolDefinition<GetRootCollectionParams> = {
  name: 'get_root_collection',
  description: 'Get the root collection from Metabase',
  inputSchema: GetRootCollectionParamsSchema,
  handler: async (client: MetabaseClient, _input: GetRootCollectionParams) => {
    const result = await client.get('/api/collection/root');
    return formatToolResponse(result);
  },
};
