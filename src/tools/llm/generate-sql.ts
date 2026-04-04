import type { MetabaseClient } from '@src/client';
import { type GenerateSqlInput, GenerateSqlInputSchema } from '@src/schemas/llm';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const generateSqlDefinition: ToolDefinition<GenerateSqlInput> = {
  name: 'generate_sql',
  description: '[Requires Metabase Pro] Generate SQL from a natural language question using AI',
  inputSchema: GenerateSqlInputSchema,
  handler: async (client: MetabaseClient, input: GenerateSqlInput) => {
    const result = await client.post('/api/llm/generate-sql', {
      question: input.question,
      database_id: input.database_id,
    });
    return formatToolResponse(result);
  },
};
