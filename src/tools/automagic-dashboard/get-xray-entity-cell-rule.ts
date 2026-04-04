import type { MetabaseClient } from '@src/client';
import {
  type GetXrayEntityCellRuleInput,
  GetXrayEntityCellRuleInputSchema,
} from '@src/schemas/automagic-dashboard';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const getXrayEntityCellRuleDefinition: ToolDefinition<GetXrayEntityCellRuleInput> = {
  name: 'get_xray_entity_cell_rule',
  description:
    'Get an x-ray automagic dashboard for a specific cell of an entity with a rule applied in Metabase',
  inputSchema: GetXrayEntityCellRuleInputSchema,
  handler: async (client: MetabaseClient, input: GetXrayEntityCellRuleInput) => {
    const result = await client.get(
      `/api/automagic-dashboards/${input.entity}/${input.entity_id_or_query}/cell/${input.cell_query}/rule/${input.prefix}/${input.dashboard_template}`,
    );
    return formatToolResponse(result);
  },
};
