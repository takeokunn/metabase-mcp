import type { MetabaseClient } from '@src/client';
import { type CopyCardParams, CopyCardParamsSchema } from '@src/schemas/card';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for copying a card (saved question) in Metabase
 */
export const copyCardDefinition: ToolDefinition<CopyCardParams> = {
  name: 'copy_card',
  description: 'Copy an existing card (saved question) in Metabase',
  inputSchema: CopyCardParamsSchema,
  handler: async (client: MetabaseClient, input: CopyCardParams) => {
    const { id, ...copyData } = input;
    const result = await client.post(`/api/card/${id}/copy`, copyData);
    return formatToolResponse(result);
  },
};
