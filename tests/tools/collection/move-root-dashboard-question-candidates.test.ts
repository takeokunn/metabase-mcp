import { MoveRootDashboardQuestionCandidatesInputSchema } from '@src/schemas/collection';
import { moveRootDashboardQuestionCandidatesDefinition } from '@src/tools/collection/move-root-dashboard-question-candidates';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('moveRootDashboardQuestionCandidates tool', () => {
  it('should return formatted MCP response', async () => {
    const mockResponse = { success: true };
    const mockClient = createMockClientWithResponse('post', mockResponse);
    const result = await moveRootDashboardQuestionCandidatesDefinition.handler(mockClient, {
      card_ids: [1, 2, 3],
    });
    expectMcpContent(result, mockResponse);
    expect(mockClient.post).toHaveBeenCalledWith(
      '/api/collection/root/move-dashboard-question-candidates',
      { card_ids: [1, 2, 3] },
    );
    expect(mockClient.post).toHaveBeenCalledOnce();
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('post', 'Not found');
    await expect(
      moveRootDashboardQuestionCandidatesDefinition.handler(mockClient, { card_ids: [1] }),
    ).rejects.toThrow('Not found');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('post', createApiError('Unauthorized', 401));
    await expect(
      moveRootDashboardQuestionCandidatesDefinition.handler(mockClient, { card_ids: [1] }),
    ).rejects.toThrow('Unauthorized');
  });

  it('should have correct tool definition metadata', () => {
    expect(moveRootDashboardQuestionCandidatesDefinition.name).toBe(
      'move_root_dashboard_question_candidates',
    );
    expect(moveRootDashboardQuestionCandidatesDefinition.description).toBe(
      'Move dashboard question candidates from the root collection in Metabase',
    );
    expect(moveRootDashboardQuestionCandidatesDefinition.inputSchema).toEqual(
      MoveRootDashboardQuestionCandidatesInputSchema,
    );
  });
});
