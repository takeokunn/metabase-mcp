import type { MetabaseClient } from '@src/client';
import {
  type UpdateGlossaryEntryInput,
  UpdateGlossaryEntryInputSchema,
} from '@src/schemas/glossary';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const updateGlossaryEntryDefinition: ToolDefinition<UpdateGlossaryEntryInput> = {
  name: 'update_glossary_entry',
  description: 'Update an existing glossary entry in Metabase',
  inputSchema: UpdateGlossaryEntryInputSchema,
  handler: async (client: MetabaseClient, input: UpdateGlossaryEntryInput) => {
    const result = await client.put(`/api/glossary/${input.id}`, {
      name: input.name,
      definition: input.definition,
      synonyms: input.synonyms,
    });
    return formatToolResponse(result);
  },
};
