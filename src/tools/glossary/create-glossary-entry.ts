import type { MetabaseClient } from '@src/client';
import { type CreateGlossaryEntryInput, CreateGlossaryEntryInputSchema } from '@src/schemas/glossary';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const createGlossaryEntryDefinition: ToolDefinition<CreateGlossaryEntryInput> = {
  name: 'create_glossary_entry',
  description: 'Create a new glossary entry in Metabase',
  inputSchema: CreateGlossaryEntryInputSchema,
  handler: async (client: MetabaseClient, input: CreateGlossaryEntryInput) => {
    const result = await client.post('/api/glossary', {
      name: input.name,
      definition: input.definition,
      synonyms: input.synonyms,
      collection_id: input.collection_id,
    });
    return formatToolResponse(result);
  },
};
