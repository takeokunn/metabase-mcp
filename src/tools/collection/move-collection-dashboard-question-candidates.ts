import type { MetabaseClient } from '@src/client';
import {
  type MoveCollectionDashboardQuestionCandidatesInput,
  MoveCollectionDashboardQuestionCandidatesInputSchema,
} from '@src/schemas/collection';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const moveCollectionDashboardQuestionCandidatesDefinition: ToolDefinition<MoveCollectionDashboardQuestionCandidatesInput> =
  {
    name: 'move_collection_dashboard_question_candidates',
    description: 'Move dashboard question candidates from a collection in Metabase',
    inputSchema: MoveCollectionDashboardQuestionCandidatesInputSchema,
    handler: async (
      client: MetabaseClient,
      input: MoveCollectionDashboardQuestionCandidatesInput,
    ) => {
      const result = await client.post(
        `/api/collection/${input.id}/move-dashboard-question-candidates`,
        { card_ids: input.card_ids },
      );
      return formatToolResponse(result);
    },
  };
