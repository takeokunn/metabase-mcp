import type { MetabaseClient } from '@src/client';
import {
  type GetXrayEntityCellInput,
  GetXrayEntityCellInputSchema,
} from '@src/schemas/automagic-dashboard';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const getXrayEntityCellDefinition: ToolDefinition<GetXrayEntityCellInput> = {
  name: 'get_xray_entity_cell',
  description: 'Get an x-ray automagic dashboard for a specific cell of an entity in Metabase',
  inputSchema: GetXrayEntityCellInputSchema,
  handler: async (client: MetabaseClient, input: GetXrayEntityCellInput) => {
    const result = await client.get(
      `/api/automagic-dashboards/${input.entity}/${input.entity_id_or_query}/cell/${input.cell_query}`,
    );
    return formatToolResponse(result);
  },
};
