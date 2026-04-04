import type { MetabaseClient } from '@src/client';
import { type GetDatasetQueryMetadataInput, GetDatasetQueryMetadataInputSchema } from '@src/schemas/dataset';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const getDatasetQueryMetadataDefinition: ToolDefinition<GetDatasetQueryMetadataInput> = {
  name: 'get_dataset_query_metadata',
  description: 'Get metadata for a dataset query in Metabase',
  inputSchema: GetDatasetQueryMetadataInputSchema,
  handler: async (client: MetabaseClient, input: GetDatasetQueryMetadataInput) => {
    const result = await client.post('/api/dataset/query_metadata', input.query);
    return formatToolResponse(result);
  },
};
