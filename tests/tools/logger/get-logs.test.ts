import { getLogsDefinition } from '@src/tools/logger/get-logs';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('getLogs tool', () => {
  it('should return formatted MCP response with logs', async () => {
    const mockResult = [
      { level: 'INFO', message: 'Server started', timestamp: '2024-01-01T00:00:00Z' },
    ];
    const mockClient = createMockClientWithResponse('get', mockResult);
    const result = await getLogsDefinition.handler(mockClient, {});
    expectMcpContent(result, mockResult);
  });

  it('should call correct endpoint without params when none provided', async () => {
    const mockClient = createMockClientWithResponse('get', []);
    await getLogsDefinition.handler(mockClient, {});
    expect(mockClient.get).toHaveBeenCalledWith('/api/logger/logs', undefined);
  });

  it('should pass level filter when provided', async () => {
    const mockClient = createMockClientWithResponse('get', []);
    await getLogsDefinition.handler(mockClient, { level: 'ERROR' });
    expect(mockClient.get).toHaveBeenCalledWith('/api/logger/logs', { level: 'ERROR' });
  });

  it('should pass all filters when provided', async () => {
    const mockClient = createMockClientWithResponse('get', []);
    await getLogsDefinition.handler(mockClient, {
      level: 'DEBUG',
      namespace: 'metabase.db',
      last_n_lines: 100,
    });
    expect(mockClient.get).toHaveBeenCalledWith('/api/logger/logs', {
      level: 'DEBUG',
      namespace: 'metabase.db',
      last_n_lines: 100,
    });
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'API error');
    await expect(getLogsDefinition.handler(mockClient, {})).rejects.toThrow('API error');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Forbidden', 403));
    await expect(getLogsDefinition.handler(mockClient, {})).rejects.toThrow('Forbidden');
  });
});
