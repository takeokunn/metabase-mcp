import type { MetabaseClient } from '@src/client';
import {
  type DeleteGlossaryEntryParams,
  DeleteGlossaryEntryParamsSchema,
} from '@src/schemas/glossary';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const deleteGlossaryEntryDefinition: ToolDefinition<DeleteGlossaryEntryParams> = {
  name: 'delete_glossary_entry',
  description: 'Delete a glossary entry from Metabase',
  inputSchema: DeleteGlossaryEntryParamsSchema,
  handler: async (client: MetabaseClient, input: DeleteGlossaryEntryParams) => {
    const result = await client.delete(`/api/glossary/${input.id}`);
    return formatToolResponse(result);
  },
};
