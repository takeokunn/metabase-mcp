import type { MetabaseClient } from '@src/client';
import { type TranslateEntityIdsInput, TranslateEntityIdsInputSchema } from '@src/schemas/eid-translation';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const translateEntityIdsDefinition: ToolDefinition<TranslateEntityIdsInput> = {
  name: 'translate_entity_ids',
  description: 'Translate entity IDs between internal and external representations in Metabase',
  inputSchema: TranslateEntityIdsInputSchema,
  handler: async (client: MetabaseClient, input: TranslateEntityIdsInput) => {
    const result = await client.post('/api/eid-translation/translate', {
      entity_ids: input.entity_ids,
    });
    return formatToolResponse(result);
  },
};
