import type { MetabaseClient } from '@src/client';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const listLlmModelsDefinition: ToolDefinition = {
  name: 'list_llm_models',
  description: '[Requires Metabase Pro] List available AI/LLM models configured in Metabase',
  inputSchema: {},
  handler: async (client: MetabaseClient) => {
    const result = await client.get('/api/llm/list-models');
    return formatToolResponse(result);
  },
};
