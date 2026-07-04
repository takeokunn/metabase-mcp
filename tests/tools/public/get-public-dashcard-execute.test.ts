import { GetPublicDashcardExecuteSchema } from '@src/schemas/public';
import { getPublicDashcardExecuteDefinition } from '@src/tools/public/get-public-dashcard-execute';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('getPublicDashcardExecute tool', () => {
  it('should return formatted MCP response', async () => {
    const mockClient = createMockClientWithResponse('get', { id: 1, name: 'Public 1' });
    const result = await getPublicDashcardExecuteDefinition.handler(mockClient, {
      uuid: 'abc-uuid',
      dashcard_id: 7,
      parameters: { pid: 10 },
    });
    expectMcpContent(result, { id: 1, name: 'Public 1' });
    expect(mockClient.get).toHaveBeenCalledWith(
      '/api/public/dashboard/abc-uuid/dashcard/7/execute',
      { parameters: JSON.stringify({ pid: 10 }) },
    );
    expect(mockClient.get).toHaveBeenCalledOnce();
  });
  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'Not found');
    await expect(
      getPublicDashcardExecuteDefinition.handler(mockClient, {
        uuid: 'abc-uuid',
        dashcard_id: 7,
        parameters: { pid: 10 },
      }),
    ).rejects.toThrow('Not found');
  });
  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Unauthorized', 401));
    await expect(
      getPublicDashcardExecuteDefinition.handler(mockClient, {
        uuid: 'abc-uuid',
        dashcard_id: 7,
        parameters: { pid: 10 },
      }),
    ).rejects.toThrow('Unauthorized');
  });
  it('should have correct tool definition metadata', () => {
    expect(getPublicDashcardExecuteDefinition.name).toBe('get_public_dashcard_execute');
    expect(getPublicDashcardExecuteDefinition.description).toBe(
      'Fetch the values for executing an action on a public dashcard in Metabase',
    );
    expect(getPublicDashcardExecuteDefinition.inputSchema).toEqual(GetPublicDashcardExecuteSchema);
  });
});
