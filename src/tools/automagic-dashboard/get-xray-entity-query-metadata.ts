import type { MetabaseClient } from '@src/client';
import {
  type GetXrayEntityQueryMetadataInput,
  GetXrayEntityQueryMetadataInputSchema,
} from '@src/schemas/automagic-dashboard';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const getXrayEntityQueryMetadataDefinition: ToolDefinition<GetXrayEntityQueryMetadataInput> =
  {
    name: 'get_xray_entity_query_metadata',
    description: 'Get query metadata for an x-ray automagic dashboard entity in Metabase',
    inputSchema: GetXrayEntityQueryMetadataInputSchema,
    handler: async (client: MetabaseClient, input: GetXrayEntityQueryMetadataInput) => {
      const result = await client.get(
        `/api/automagic-dashboards/${input.entity}/${input.entity_id_or_query}/query_metadata`,
      );
      return formatToolResponse(result);
    },
  };
