import type { MetabaseClient } from '@src/client';
import {
  type CheckDatabaseWorkspacePermissionInput,
  CheckDatabaseWorkspacePermissionInputSchema,
} from '@src/schemas/database';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const checkDatabaseWorkspacePermissionDefinition: ToolDefinition<CheckDatabaseWorkspacePermissionInput> =
  {
    name: 'check_database_workspace_permission',
    description: 'Check workspace permission for a database in Metabase',
    inputSchema: CheckDatabaseWorkspacePermissionInputSchema,
    handler: async (client: MetabaseClient, input: CheckDatabaseWorkspacePermissionInput) => {
      const result = await client.post(`/api/database/${input.id}/permission/workspace/check`, {});
      return formatToolResponse(result);
    },
  };
