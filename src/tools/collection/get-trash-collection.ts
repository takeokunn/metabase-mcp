import type { MetabaseClient } from '@src/client';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';
import { z } from 'zod';

const GetTrashCollectionParamsSchema = z.object({});
type GetTrashCollectionParams = z.infer<typeof GetTrashCollectionParamsSchema>;

/**
 * Tool definition for getting the trash collection
 */
export const getTrashCollectionDefinition: ToolDefinition<GetTrashCollectionParams> = {
  name: 'get_trash_collection',
  description: 'Get the trash collection from Metabase',
  inputSchema: GetTrashCollectionParamsSchema,
  handler: async (client: MetabaseClient, _input: GetTrashCollectionParams) => {
    const result = await client.get('/api/collection/trash');
    return formatToolResponse(result);
  },
};
