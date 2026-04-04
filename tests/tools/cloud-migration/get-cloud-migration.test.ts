import { getCloudMigrationDefinition } from '@src/tools/cloud-migration/get-cloud-migration';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('getCloudMigration tool', () => {
  it('should return formatted MCP response with migration status', async () => {
    const mockResult = { id: 1, state: 'in_progress', progress: 0.5 };
    const mockClient = createMockClientWithResponse('get', mockResult);
    const result = await getCloudMigrationDefinition.handler(mockClient, {});
    expectMcpContent(result, mockResult);
  });

  it('should call correct endpoint', async () => {
    const mockClient = createMockClientWithResponse('get', {});
    await getCloudMigrationDefinition.handler(mockClient, {});
    expect(mockClient.get).toHaveBeenCalledWith('/api/cloud-migration');
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'API error');
    await expect(getCloudMigrationDefinition.handler(mockClient, {})).rejects.toThrow('API error');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Not Found', 404));
    await expect(getCloudMigrationDefinition.handler(mockClient, {})).rejects.toThrow('Not Found');
  });
});
