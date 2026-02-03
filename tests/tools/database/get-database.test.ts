import { GetDatabaseParamsSchema } from '@src/schemas/database';
import { getDatabaseDefinition } from '@src/tools/database/get-database';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('getDatabase tool', () => {
  it('should return formatted MCP response with database data', async () => {
    const mockDatabase = {
      id: 1,
      name: 'Production DB',
      engine: 'postgres',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-15T12:00:00Z',
    };

    const mockClient = createMockClientWithResponse('get', mockDatabase);

    const result = await getDatabaseDefinition.handler(mockClient, { id: 1 });

    expectMcpContent(result, mockDatabase);
    expect(mockClient.get).toHaveBeenCalledWith('/api/database/1');
    expect(mockClient.get).toHaveBeenCalledOnce();
  });

  it('should handle database with minimal data', async () => {
    const mockDatabase = {
      id: 42,
      name: 'Analytics DB',
      engine: 'bigquery',
    };

    const mockClient = createMockClientWithResponse('get', mockDatabase);

    const result = await getDatabaseDefinition.handler(mockClient, { id: 42 });

    expectMcpContent(result, mockDatabase);
    expect(mockClient.get).toHaveBeenCalledWith('/api/database/42');
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'Database not found');

    await expect(getDatabaseDefinition.handler(mockClient, { id: 999 })).rejects.toThrow(
      'Database not found',
    );
    expect(mockClient.get).toHaveBeenCalledWith('/api/database/999');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Unauthorized', 401));

    await expect(getDatabaseDefinition.handler(mockClient, { id: 1 })).rejects.toThrow(
      'Unauthorized',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(getDatabaseDefinition.name).toBe('get_database');
    expect(getDatabaseDefinition.description).toBe('Get a single database by ID from Metabase');
    expect(getDatabaseDefinition.inputSchema).toEqual(GetDatabaseParamsSchema);
  });
});
