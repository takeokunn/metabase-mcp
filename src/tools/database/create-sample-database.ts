import type { MetabaseClient } from '@src/client';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for creating the built-in sample database in Metabase
 */
export const createSampleDatabaseDefinition: ToolDefinition = {
  name: 'create_sample_database',
  description: 'Create the built-in sample database in Metabase',
  inputSchema: {},
  handler: async (client: MetabaseClient) => {
    const result = await client.post('/api/database/sample_database');
    return formatToolResponse(result);
  },
};
