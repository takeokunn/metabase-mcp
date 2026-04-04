import type { MetabaseClient } from '@src/client';
import { type RevertRevisionInput, RevertRevisionInputSchema } from '@src/schemas/revision';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for reverting an entity to a previous revision in Metabase
 */
export const revertRevisionDefinition: ToolDefinition<RevertRevisionInput> = {
  name: 'revert_revision',
  description: 'Revert a Metabase entity (dashboard, card, etc.) to a previous revision',
  inputSchema: RevertRevisionInputSchema,
  handler: async (client: MetabaseClient, input: RevertRevisionInput) => {
    const result = await client.post('/api/revision/revert', {
      entity: input.entity,
      id: input.id,
      revision_id: input.revision_id,
    });
    return formatToolResponse(result);
  },
};
