import type { MetabaseClient } from '@src/client';
import { type GetEntityRevisionInput, GetEntityRevisionInputSchema } from '@src/schemas/revision';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const getEntityRevisionDefinition: ToolDefinition<GetEntityRevisionInput> = {
  name: 'get_entity_revision',
  description: 'Get revision history for a specific entity by type and ID in Metabase',
  inputSchema: GetEntityRevisionInputSchema,
  handler: async (client: MetabaseClient, input: GetEntityRevisionInput) => {
    const result = await client.get(`/api/revision/${input.entity}/${input.id}`);
    return formatToolResponse(result);
  },
};
