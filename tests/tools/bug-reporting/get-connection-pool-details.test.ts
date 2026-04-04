import { getConnectionPoolDetailsDefinition } from '@src/tools/bug-reporting/get-connection-pool-details';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('getConnectionPoolDetails tool', () => {
  it('should return formatted MCP response with pool details', async () => {
    const mockResult = { pools: [{ name: 'main', size: 10, active: 3 }] };
    const mockClient = createMockClientWithResponse('get', mockResult);
    const result = await getConnectionPoolDetailsDefinition.handler(mockClient, {});
    expectMcpContent(result, mockResult);
  });

  it('should call correct endpoint', async () => {
    const mockClient = createMockClientWithResponse('get', {});
    await getConnectionPoolDetailsDefinition.handler(mockClient, {});
    expect(mockClient.get).toHaveBeenCalledWith('/api/bug-reporting/connection-pool-details');
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'API error');
    await expect(getConnectionPoolDetailsDefinition.handler(mockClient, {})).rejects.toThrow('API error');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Unauthorized', 401));
    await expect(getConnectionPoolDetailsDefinition.handler(mockClient, {})).rejects.toThrow('Unauthorized');
  });
});
