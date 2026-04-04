import type { MetabaseClient } from '@src/client';
import {
  type GetXrayEntityRuleCompareInput,
  GetXrayEntityRuleCompareInputSchema,
} from '@src/schemas/automagic-dashboard';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const getXrayEntityRuleCompareDefinition: ToolDefinition<GetXrayEntityRuleCompareInput> = {
  name: 'get_xray_entity_rule_compare',
  description:
    'Get a comparison x-ray automagic dashboard for an entity with a rule applied in Metabase',
  inputSchema: GetXrayEntityRuleCompareInputSchema,
  handler: async (client: MetabaseClient, input: GetXrayEntityRuleCompareInput) => {
    const result = await client.get(
      `/api/automagic-dashboards/${input.entity}/${input.entity_id_or_query}/rule/${input.prefix}/${input.dashboard_template}/compare/${input.comparison_entity}/${input.comparison_entity_id_or_query}`,
    );
    return formatToolResponse(result);
  },
};
