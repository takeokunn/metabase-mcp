import { createDatabaseDefinition } from '@src/tools/database/create-database';
import { describe, expect, it } from 'vitest';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('createDatabase tool', () => {
  it('should create a database and return formatted MCP response', async () => {
    const mockResponse = {
      id: 1,
      name: 'New Database',
      engine: 'postgres',
    };

    const mockClient = createMockClientWithResponse('post', mockResponse);

    const input = {
      name: 'New Database',
      engine: 'postgres' as const,
      details: { host: 'localhost', port: 5432 },
    };

    const result = await createDatabaseDefinition.handler(mockClient, input);

    expectMcpContent(result, mockResponse);
    expect(mockClient.post).toHaveBeenCalledWith('/api/database', {
      name: 'New Database',
      engine: 'postgres',
      details: { host: 'localhost', port: 5432 },
    });
  });

  it('should use empty object for details when not provided', async () => {
    const mockResponse = { id: 1, name: 'Test DB', engine: 'h2' };

    const mockClient = createMockClientWithResponse('post', mockResponse);

    const input = {
      name: 'Test DB',
      engine: 'h2' as const,
    };

    await createDatabaseDefinition.handler(mockClient, input);

    expect(mockClient.post).toHaveBeenCalledWith('/api/database', {
      name: 'Test DB',
      engine: 'h2',
      details: {},
    });
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('post', 'API error');

    const input = {
      name: 'Test DB',
      engine: 'postgres' as const,
    };

    await expect(createDatabaseDefinition.handler(mockClient, input)).rejects.toThrow('API error');
  });

  it('should have correct tool definition metadata', () => {
    expect(createDatabaseDefinition.name).toBe('create_database');
    expect(createDatabaseDefinition.description).toBe('Add a new database connection to Metabase');
    expect(createDatabaseDefinition.inputSchema).toBeDefined();
  });
});
