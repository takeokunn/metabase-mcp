import type { MetabaseClient } from '@src/client';
import { type GetDatasetParamRemappingInput, GetDatasetParamRemappingInputSchema } from '@src/schemas/dataset';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const getDatasetParamRemappingDefinition: ToolDefinition<GetDatasetParamRemappingInput> = {
  name: 'get_dataset_param_remapping',
  description: 'Get remapping for a dataset parameter in Metabase',
  inputSchema: GetDatasetParamRemappingInputSchema,
  handler: async (client: MetabaseClient, input: GetDatasetParamRemappingInput) => {
    const result = await client.post('/api/dataset/parameter/remapping', { parameter: input.parameter, field_ids: input.field_ids });
    return formatToolResponse(result);
  },
};
