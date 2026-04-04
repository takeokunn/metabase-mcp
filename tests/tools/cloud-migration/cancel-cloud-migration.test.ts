import { cancelCloudMigrationDefinition } from '@src/tools/cloud-migration/cancel-cloud-migration';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('cancelCloudMigration tool', () => {
  it('should return formatted MCP response', async () => {
    const mockResult = { id: 1, state: 'cancelled' };
    const mockClient = createMockClientWithResponse('put', mockResult);
    const result = await cancelCloudMigrationDefinition.handler(mockClient, {});
    expectMcpContent(result, mockResult);
  });

  it('should call correct endpoint', async () => {
    const mockClient = createMockClientWithResponse('put', {});
    await cancelCloudMigrationDefinition.handler(mockClient, {});
    expect(mockClient.put).toHaveBeenCalledWith('/api/cloud-migration/cancel');
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('put', 'API error');
    await expect(cancelCloudMigrationDefinition.handler(mockClient, {})).rejects.toThrow(
      'API error',
    );
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('put', createApiError('Conflict', 409));
    await expect(cancelCloudMigrationDefinition.handler(mockClient, {})).rejects.toThrow(
      'Conflict',
    );
  });
});
