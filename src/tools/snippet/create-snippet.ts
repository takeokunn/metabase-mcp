import type { MetabaseClient } from '@src/client';
import { type CreateSnippetInput, CreateSnippetInputSchema } from '@src/schemas/snippet';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for creating a new native query snippet in Metabase
 */
export const createSnippetDefinition: ToolDefinition<CreateSnippetInput> = {
  name: 'create_snippet',
  description: 'Create a new native query snippet in Metabase',
  inputSchema: CreateSnippetInputSchema,
  handler: async (client: MetabaseClient, input: CreateSnippetInput) => {
    const result = await client.post('/api/native-query-snippet', {
      name: input.name,
      content: input.content,
      description: input.description,
      collection_id: input.collection_id,
    });
    return formatToolResponse(result);
  },
};
