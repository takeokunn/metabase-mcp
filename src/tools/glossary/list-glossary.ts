import type { MetabaseClient } from '@src/client';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const listGlossaryDefinition: ToolDefinition = {
  name: 'list_glossary',
  description: 'List all glossary entries in Metabase',
  inputSchema: {},
  handler: async (client: MetabaseClient) => {
    const result = await client.get('/api/glossary');
    return formatToolResponse(result);
  },
};
