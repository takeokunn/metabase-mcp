import type { MetabaseClient } from '@src/client';
import { type MoveRootDashboardQuestionCandidatesInput, MoveRootDashboardQuestionCandidatesInputSchema } from '@src/schemas/collection';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const moveRootDashboardQuestionCandidatesDefinition: ToolDefinition<MoveRootDashboardQuestionCandidatesInput> = {
  name: 'move_root_dashboard_question_candidates',
  description: 'Move dashboard question candidates from the root collection in Metabase',
  inputSchema: MoveRootDashboardQuestionCandidatesInputSchema,
  handler: async (client: MetabaseClient, input: MoveRootDashboardQuestionCandidatesInput) => {
    const result = await client.post('/api/collection/root/move-dashboard-question-candidates', { card_ids: input.card_ids });
    return formatToolResponse(result);
  },
};
