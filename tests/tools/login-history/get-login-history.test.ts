import { getLoginHistoryDefinition } from '@src/tools/login-history/get-login-history';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('getLoginHistory tool', () => {
  it('should return formatted MCP response', async () => {
    const mockResult = [
      { timestamp: '2024-01-01T00:00:00Z', ip_address: '127.0.0.1', device: 'Chrome' },
    ];
    const mockClient = createMockClientWithResponse('get', mockResult);
    const result = await getLoginHistoryDefinition.handler(mockClient, {});
    expectMcpContent(result, mockResult);
    expect(mockClient.get).toHaveBeenCalledWith('/api/login-history/current');
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'API error');
    await expect(getLoginHistoryDefinition.handler(mockClient, {})).rejects.toThrow('API error');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Unauthorized', 401));
    await expect(getLoginHistoryDefinition.handler(mockClient, {})).rejects.toThrow('Unauthorized');
  });

  it('should have correct tool definition metadata', () => {
    expect(getLoginHistoryDefinition.name).toBe('get_login_history');
  });
});
