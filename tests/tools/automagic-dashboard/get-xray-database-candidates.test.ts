import { GetXrayDatabaseCandidatesParamsSchema } from '@src/schemas/automagic-dashboard';
import { getXrayDatabaseCandidatesDefinition } from '@src/tools/automagic-dashboard/get-xray-database-candidates';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('getXrayDatabaseCandidates tool', () => {
  it('should return formatted MCP response', async () => {
    const mockResult = [{ id: 1, name: 'Candidate Table' }];
    const mockClient = createMockClientWithResponse('get', mockResult);
    const result = await getXrayDatabaseCandidatesDefinition.handler(mockClient, { id: 1 });
    expectMcpContent(result, mockResult);
    expect(mockClient.get).toHaveBeenCalledWith('/api/automagic-dashboards/database/1/candidates');
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'API error');
    await expect(getXrayDatabaseCandidatesDefinition.handler(mockClient, { id: 1 })).rejects.toThrow('API error');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Unauthorized', 401));
    await expect(getXrayDatabaseCandidatesDefinition.handler(mockClient, { id: 1 })).rejects.toThrow('Unauthorized');
  });

  it('should have correct metadata', () => {
    expect(getXrayDatabaseCandidatesDefinition.name).toBe('get_xray_database_candidates');
    expect(getXrayDatabaseCandidatesDefinition.inputSchema).toEqual(GetXrayDatabaseCandidatesParamsSchema);
  });
});
