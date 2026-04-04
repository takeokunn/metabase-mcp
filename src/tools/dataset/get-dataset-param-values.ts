import type { MetabaseClient } from '@src/client';
import { type GetDatasetParamValuesInput, GetDatasetParamValuesInputSchema } from '@src/schemas/dataset';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const getDatasetParamValuesDefinition: ToolDefinition<GetDatasetParamValuesInput> = {
  name: 'get_dataset_param_values',
  description: 'Get values for a dataset parameter in Metabase',
  inputSchema: GetDatasetParamValuesInputSchema,
  handler: async (client: MetabaseClient, input: GetDatasetParamValuesInput) => {
    const result = await client.post('/api/dataset/parameter/values', { parameter: input.parameter, field_ids: input.field_ids });
    return formatToolResponse(result);
  },
};
