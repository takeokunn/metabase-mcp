import { persistDatabaseModelsDefinition } from '@src/tools/persist/persist-database-models';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('persistDatabaseModels tool', () => {
  it('should return formatted MCP response', async () => {
    const mockResult = { success: true };
    const mockClient = createMockClientWithResponse('post', mockResult);
    const result = await persistDatabaseModelsDefinition.handler(mockClient, { db_id: 3 });
    expectMcpContent(result, mockResult);
    expect(mockClient.post).toHaveBeenCalledWith('/api/persist/database/3/persist');
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('post', 'API error');
    await expect(persistDatabaseModelsDefinition.handler(mockClient, { db_id: 3 })).rejects.toThrow('API error');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('post', createApiError('Not Found', 404));
    await expect(persistDatabaseModelsDefinition.handler(mockClient, { db_id: 999 })).rejects.toThrow('Not Found');
  });

  it('should have correct tool definition metadata', () => {
    expect(persistDatabaseModelsDefinition.name).toBe('persist_database_models');
  });
});
