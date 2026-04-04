import type { MetabaseClient } from '@src/client';
import {
  type GetXrayEntityCellRuleCompareInput,
  GetXrayEntityCellRuleCompareInputSchema,
} from '@src/schemas/automagic-dashboard';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const getXrayEntityCellRuleCompareDefinition: ToolDefinition<GetXrayEntityCellRuleCompareInput> =
  {
    name: 'get_xray_entity_cell_rule_compare',
    description:
      'Get a comparison x-ray automagic dashboard for a specific cell of an entity with a rule applied in Metabase',
    inputSchema: GetXrayEntityCellRuleCompareInputSchema,
    handler: async (client: MetabaseClient, input: GetXrayEntityCellRuleCompareInput) => {
      const result = await client.get(
        `/api/automagic-dashboards/${input.entity}/${input.entity_id_or_query}/cell/${input.cell_query}/rule/${input.prefix}/${input.dashboard_template}/compare/${input.comparison_entity}/${input.comparison_entity_id_or_query}`,
      );
      return formatToolResponse(result);
    },
  };
