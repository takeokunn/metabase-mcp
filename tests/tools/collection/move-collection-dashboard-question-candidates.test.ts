import { MoveCollectionDashboardQuestionCandidatesInputSchema } from '@src/schemas/collection';
import { moveCollectionDashboardQuestionCandidatesDefinition } from '@src/tools/collection/move-collection-dashboard-question-candidates';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('moveCollectionDashboardQuestionCandidates tool', () => {
  it('should return formatted MCP response', async () => {
    const mockResponse = { success: true };
    const mockClient = createMockClientWithResponse('post', mockResponse);
    const result = await moveCollectionDashboardQuestionCandidatesDefinition.handler(mockClient, {
      id: '10',
      card_ids: [1, 2],
    });
    expectMcpContent(result, mockResponse);
    expect(mockClient.post).toHaveBeenCalledWith(
      '/api/collection/10/move-dashboard-question-candidates',
      { card_ids: [1, 2] },
    );
    expect(mockClient.post).toHaveBeenCalledOnce();
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('post', 'Not found');
    await expect(
      moveCollectionDashboardQuestionCandidatesDefinition.handler(mockClient, {
        id: '999',
        card_ids: [1],
      }),
    ).rejects.toThrow('Not found');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('post', createApiError('Unauthorized', 401));
    await expect(
      moveCollectionDashboardQuestionCandidatesDefinition.handler(mockClient, {
        id: '1',
        card_ids: [1],
      }),
    ).rejects.toThrow('Unauthorized');
  });

  it('should have correct tool definition metadata', () => {
    expect(moveCollectionDashboardQuestionCandidatesDefinition.name).toBe(
      'move_collection_dashboard_question_candidates',
    );
    expect(moveCollectionDashboardQuestionCandidatesDefinition.description).toBe(
      'Move dashboard question candidates from a collection in Metabase',
    );
    expect(moveCollectionDashboardQuestionCandidatesDefinition.inputSchema).toEqual(
      MoveCollectionDashboardQuestionCandidatesInputSchema,
    );
  });
});
