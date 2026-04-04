import type { MetabaseClient } from '@src/client';
import {
  type GetXrayDatabaseCandidatesParams,
  GetXrayDatabaseCandidatesParamsSchema,
} from '@src/schemas/automagic-dashboard';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const getXrayDatabaseCandidatesDefinition: ToolDefinition<GetXrayDatabaseCandidatesParams> =
  {
    name: 'get_xray_database_candidates',
    description: 'Get X-ray dashboard candidates for a database in Metabase',
    inputSchema: GetXrayDatabaseCandidatesParamsSchema,
    handler: async (client: MetabaseClient, input: GetXrayDatabaseCandidatesParams) => {
      const result = await client.get(`/api/automagic-dashboards/database/${input.id}/candidates`);
      return formatToolResponse(result);
    },
  };
