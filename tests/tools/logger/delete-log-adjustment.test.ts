import { deleteLogAdjustmentDefinition } from '@src/tools/logger/delete-log-adjustment';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('deleteLogAdjustment tool', () => {
  it('should return formatted MCP response', async () => {
    const mockResult = null;
    const mockClient = createMockClientWithResponse('delete', mockResult);
    const result = await deleteLogAdjustmentDefinition.handler(mockClient, {});
    expectMcpContent(result, mockResult);
  });

  it('should call correct endpoint', async () => {
    const mockClient = createMockClientWithResponse('delete', null);
    await deleteLogAdjustmentDefinition.handler(mockClient, {});
    expect(mockClient.delete).toHaveBeenCalledWith('/api/logger/adjustment');
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('delete', 'API error');
    await expect(deleteLogAdjustmentDefinition.handler(mockClient, {})).rejects.toThrow(
      'API error',
    );
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('delete', createApiError('Forbidden', 403));
    await expect(deleteLogAdjustmentDefinition.handler(mockClient, {})).rejects.toThrow(
      'Forbidden',
    );
  });
});
