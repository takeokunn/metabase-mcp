import type { MetabaseClient } from '@src/client';
import { type GetCollectionDashboardQuestionCandidatesParams, GetCollectionDashboardQuestionCandidatesParamsSchema } from '@src/schemas/collection';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const getCollectionDashboardQuestionCandidatesDefinition: ToolDefinition<GetCollectionDashboardQuestionCandidatesParams> = {
  name: 'get_collection_dashboard_question_candidates',
  description: 'Get dashboard question candidates from a collection in Metabase',
  inputSchema: GetCollectionDashboardQuestionCandidatesParamsSchema,
  handler: async (client: MetabaseClient, input: GetCollectionDashboardQuestionCandidatesParams) => {
    const result = await client.get(`/api/collection/${input.id}/dashboard-question-candidates`);
    return formatToolResponse(result);
  },
};
