import type { MetabaseClient } from '@src/client';
import {
  type GetValidFilterFieldsInput,
  GetValidFilterFieldsInputSchema,
} from '@src/schemas/dashboard';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const getValidFilterFieldsDefinition: ToolDefinition<GetValidFilterFieldsInput> = {
  name: 'get_valid_filter_fields',
  description: 'Get valid filter fields for dashboard parameters in Metabase',
  inputSchema: GetValidFilterFieldsInputSchema,
  handler: async (client: MetabaseClient, input: GetValidFilterFieldsInput) => {
    const result = await client.get('/api/dashboard/params/valid-filter-fields', {
      filtered: input.filtered,
      filtering: input.filtering,
    });
    return formatToolResponse(result);
  },
};
