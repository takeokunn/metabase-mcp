import { initiateCloudMigrationDefinition } from '@src/tools/cloud-migration/initiate-cloud-migration';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('initiateCloudMigration tool', () => {
  const input = { store_api_key: 'sk-test-abc123' };

  it('should return formatted MCP response', async () => {
    const mockResult = { id: 1, state: 'init', created_at: '2024-01-01T00:00:00Z' };
    const mockClient = createMockClientWithResponse('post', mockResult);
    const result = await initiateCloudMigrationDefinition.handler(mockClient, input);
    expectMcpContent(result, mockResult);
  });

  it('should call correct endpoint with store_api_key', async () => {
    const mockClient = createMockClientWithResponse('post', {});
    await initiateCloudMigrationDefinition.handler(mockClient, input);
    expect(mockClient.post).toHaveBeenCalledWith('/api/cloud-migration', {
      store_api_key: input.store_api_key,
    });
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('post', 'API error');
    await expect(initiateCloudMigrationDefinition.handler(mockClient, input)).rejects.toThrow(
      'API error',
    );
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('post', createApiError('Forbidden', 403));
    await expect(initiateCloudMigrationDefinition.handler(mockClient, input)).rejects.toThrow(
      'Forbidden',
    );
  });
});
