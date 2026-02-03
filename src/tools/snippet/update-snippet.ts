import type { MetabaseClient } from '@src/client';
import { type UpdateSnippetInput, UpdateSnippetInputSchema } from '@src/schemas/snippet';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for updating an existing native query snippet in Metabase
 */
export const updateSnippetDefinition: ToolDefinition<UpdateSnippetInput> = {
  name: 'update_snippet',
  description: 'Update an existing native query snippet in Metabase',
  inputSchema: UpdateSnippetInputSchema,
  handler: async (client: MetabaseClient, input: UpdateSnippetInput) => {
    const { id, ...updateData } = input;
    const result = await client.put(`/api/native-query-snippet/${id}`, updateData);
    return formatToolResponse(result);
  },
};
