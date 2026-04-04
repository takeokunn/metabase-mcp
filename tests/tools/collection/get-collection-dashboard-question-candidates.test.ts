import { GetCollectionDashboardQuestionCandidatesParamsSchema } from '@src/schemas/collection';
import { getCollectionDashboardQuestionCandidatesDefinition } from '@src/tools/collection/get-collection-dashboard-question-candidates';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('getCollectionDashboardQuestionCandidates tool', () => {
  it('should return formatted MCP response', async () => {
    const mockResponse = [{ id: 1, name: 'Question 1' }];
    const mockClient = createMockClientWithResponse('get', mockResponse);
    const result = await getCollectionDashboardQuestionCandidatesDefinition.handler(mockClient, { id: '42' });
    expectMcpContent(result, mockResponse);
    expect(mockClient.get).toHaveBeenCalledWith('/api/collection/42/dashboard-question-candidates');
    expect(mockClient.get).toHaveBeenCalledOnce();
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'Not found');
    await expect(getCollectionDashboardQuestionCandidatesDefinition.handler(mockClient, { id: '999' })).rejects.toThrow('Not found');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Unauthorized', 401));
    await expect(getCollectionDashboardQuestionCandidatesDefinition.handler(mockClient, { id: '1' })).rejects.toThrow('Unauthorized');
  });

  it('should have correct tool definition metadata', () => {
    expect(getCollectionDashboardQuestionCandidatesDefinition.name).toBe('get_collection_dashboard_question_candidates');
    expect(getCollectionDashboardQuestionCandidatesDefinition.description).toBe('Get dashboard question candidates from a collection in Metabase');
    expect(getCollectionDashboardQuestionCandidatesDefinition.inputSchema).toEqual(GetCollectionDashboardQuestionCandidatesParamsSchema);
  });
});
