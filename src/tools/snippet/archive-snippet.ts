import type { MetabaseClient } from '@src/client';
import { type ArchiveSnippetInput, ArchiveSnippetInputSchema } from '@src/schemas/snippet';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for archiving a native query snippet in Metabase
 */
export const archiveSnippetDefinition: ToolDefinition<ArchiveSnippetInput> = {
  name: 'archive_snippet',
  description: 'Archive a native query snippet in Metabase',
  inputSchema: ArchiveSnippetInputSchema,
  handler: async (client: MetabaseClient, input: ArchiveSnippetInput) => {
    const result = await client.put(`/api/native-query-snippet/${input.id}`, {
      archived: true,
    });
    return formatToolResponse(result);
  },
};
