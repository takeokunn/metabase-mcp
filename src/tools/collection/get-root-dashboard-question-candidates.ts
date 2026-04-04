import type { MetabaseClient } from '@src/client';
import { type GetRootDashboardQuestionCandidatesParams, GetRootDashboardQuestionCandidatesParamsSchema } from '@src/schemas/collection';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const getRootDashboardQuestionCandidatesDefinition: ToolDefinition<GetRootDashboardQuestionCandidatesParams> = {
  name: 'get_root_dashboard_question_candidates',
  description: 'Get dashboard question candidates from the root collection in Metabase',
  inputSchema: GetRootDashboardQuestionCandidatesParamsSchema,
  handler: async (client: MetabaseClient, _input: GetRootDashboardQuestionCandidatesParams) => {
    const result = await client.get('/api/collection/root/dashboard-question-candidates');
    return formatToolResponse(result);
  },
};
