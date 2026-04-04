import { UnpersistDatabaseModelsInputSchema } from '@src/schemas/persist';
import { unpersistDatabaseModelsDefinition } from '@src/tools/persist/unpersist-database-models';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('unpersistDatabaseModels tool', () => {
  it('should return formatted MCP response', async () => {
    const mockClient = createMockClientWithResponse('post', { id: 1 });
    const result = await unpersistDatabaseModelsDefinition.handler(mockClient, { id: 1 });
    expectMcpContent(result, { id: 1 });
    expect(mockClient.post).toHaveBeenCalledWith('/api/persist/database/1/unpersist', {});
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('post', 'Not found');
    await expect(unpersistDatabaseModelsDefinition.handler(mockClient, { id: 999 })).rejects.toThrow('Not found');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('post', createApiError('Unauthorized', 401));
    await expect(unpersistDatabaseModelsDefinition.handler(mockClient, { id: 1 })).rejects.toThrow('Unauthorized');
  });

  it('should have correct tool definition metadata', () => {
    expect(unpersistDatabaseModelsDefinition.name).toBe('unpersist_database_models');
    expect(unpersistDatabaseModelsDefinition.description).toBe('Unpersist all persisted models for a database in Metabase');
    expect(unpersistDatabaseModelsDefinition.inputSchema).toEqual(UnpersistDatabaseModelsInputSchema);
  });
});
