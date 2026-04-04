import { createLogAdjustmentDefinition } from '@src/tools/logger/create-log-adjustment';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('createLogAdjustment tool', () => {
  const input = { logger: 'metabase.db', level: 'DEBUG', duration_ms: 60000 };

  it('should return formatted MCP response', async () => {
    const mockResult = { success: true };
    const mockClient = createMockClientWithResponse('post', mockResult);
    const result = await createLogAdjustmentDefinition.handler(mockClient, input);
    expectMcpContent(result, mockResult);
  });

  it('should call correct endpoint with adjustment params', async () => {
    const mockClient = createMockClientWithResponse('post', {});
    await createLogAdjustmentDefinition.handler(mockClient, input);
    expect(mockClient.post).toHaveBeenCalledWith('/api/logger/adjustment', {
      logger: 'metabase.db',
      level: 'DEBUG',
      duration_ms: 60000,
    });
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('post', 'API error');
    await expect(createLogAdjustmentDefinition.handler(mockClient, input)).rejects.toThrow(
      'API error',
    );
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('post', createApiError('Forbidden', 403));
    await expect(createLogAdjustmentDefinition.handler(mockClient, input)).rejects.toThrow(
      'Forbidden',
    );
  });
});
