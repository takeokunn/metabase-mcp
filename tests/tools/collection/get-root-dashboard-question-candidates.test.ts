import { GetRootDashboardQuestionCandidatesParamsSchema } from '@src/schemas/collection';
import { getRootDashboardQuestionCandidatesDefinition } from '@src/tools/collection/get-root-dashboard-question-candidates';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('getRootDashboardQuestionCandidates tool', () => {
  it('should return formatted MCP response', async () => {
    const mockResponse = [{ id: 1, name: 'Question 1' }];
    const mockClient = createMockClientWithResponse('get', mockResponse);
    const result = await getRootDashboardQuestionCandidatesDefinition.handler(mockClient, {});
    expectMcpContent(result, mockResponse);
    expect(mockClient.get).toHaveBeenCalledWith('/api/collection/root/dashboard-question-candidates');
    expect(mockClient.get).toHaveBeenCalledOnce();
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'Not found');
    await expect(getRootDashboardQuestionCandidatesDefinition.handler(mockClient, {})).rejects.toThrow('Not found');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Unauthorized', 401));
    await expect(getRootDashboardQuestionCandidatesDefinition.handler(mockClient, {})).rejects.toThrow('Unauthorized');
  });

  it('should have correct tool definition metadata', () => {
    expect(getRootDashboardQuestionCandidatesDefinition.name).toBe('get_root_dashboard_question_candidates');
    expect(getRootDashboardQuestionCandidatesDefinition.description).toBe('Get dashboard question candidates from the root collection in Metabase');
    expect(getRootDashboardQuestionCandidatesDefinition.inputSchema).toEqual(GetRootDashboardQuestionCandidatesParamsSchema);
  });
});
