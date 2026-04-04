import type { MetabaseClient } from '@src/client';
import {
  type DismissDatabaseSpinnerInput,
  DismissDatabaseSpinnerInputSchema,
} from '@src/schemas/database';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const dismissDatabaseSpinnerDefinition: ToolDefinition<DismissDatabaseSpinnerInput> = {
  name: 'dismiss_database_spinner',
  description: 'Dismiss the loading spinner for a database in Metabase',
  inputSchema: DismissDatabaseSpinnerInputSchema,
  handler: async (client: MetabaseClient, input: DismissDatabaseSpinnerInput) => {
    const result = await client.post(`/api/database/${input.id}/dismiss_spinner`, {});
    return formatToolResponse(result);
  },
};
