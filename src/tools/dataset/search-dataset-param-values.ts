import type { MetabaseClient } from '@src/client';
import {
  type SearchDatasetParamValuesInput,
  SearchDatasetParamValuesInputSchema,
} from '@src/schemas/dataset';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const searchDatasetParamValuesDefinition: ToolDefinition<SearchDatasetParamValuesInput> = {
  name: 'search_dataset_param_values',
  description: 'Search values for a dataset parameter in Metabase',
  inputSchema: SearchDatasetParamValuesInputSchema,
  handler: async (client: MetabaseClient, input: SearchDatasetParamValuesInput) => {
    const result = await client.post(`/api/dataset/parameter/search/${input.query}`, {
      parameter: input.parameter,
      field_ids: input.field_ids,
    });
    return formatToolResponse(result);
  },
};
