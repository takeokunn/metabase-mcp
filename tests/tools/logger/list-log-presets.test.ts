import { listLogPresetsDefinition } from '@src/tools/logger/list-log-presets';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('listLogPresets tool', () => {
  it('should return formatted MCP response with presets', async () => {
    const mockResult = [{ name: 'verbose-db', loggers: [{ logger: 'metabase.db', level: 'DEBUG' }] }];
    const mockClient = createMockClientWithResponse('get', mockResult);
    const result = await listLogPresetsDefinition.handler(mockClient, {});
    expectMcpContent(result, mockResult);
  });

  it('should call correct endpoint', async () => {
    const mockClient = createMockClientWithResponse('get', []);
    await listLogPresetsDefinition.handler(mockClient, {});
    expect(mockClient.get).toHaveBeenCalledWith('/api/logger/presets');
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'API error');
    await expect(listLogPresetsDefinition.handler(mockClient, {})).rejects.toThrow('API error');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Unauthorized', 401));
    await expect(listLogPresetsDefinition.handler(mockClient, {})).rejects.toThrow('Unauthorized');
  });
});
