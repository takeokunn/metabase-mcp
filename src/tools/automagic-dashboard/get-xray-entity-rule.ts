import type { MetabaseClient } from '@src/client';
import {
  type GetXrayEntityRuleInput,
  GetXrayEntityRuleInputSchema,
} from '@src/schemas/automagic-dashboard';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const getXrayEntityRuleDefinition: ToolDefinition<GetXrayEntityRuleInput> = {
  name: 'get_xray_entity_rule',
  description: 'Get an x-ray automagic dashboard for an entity with a rule applied in Metabase',
  inputSchema: GetXrayEntityRuleInputSchema,
  handler: async (client: MetabaseClient, input: GetXrayEntityRuleInput) => {
    const result = await client.get(
      `/api/automagic-dashboards/${input.entity}/${input.entity_id_or_query}/rule/${input.prefix}/${input.dashboard_template}`,
    );
    return formatToolResponse(result);
  },
};
