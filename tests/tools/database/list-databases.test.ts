import { listDatabasesDefinition } from '@src/tools/database/list-databases';
import { describe, expect, it } from 'vitest';

import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('listDatabases tool', () => {
  it('should return formatted MCP response with databases', async () => {
    const mockDatabases = [
      { id: 1, name: 'Production DB', engine: 'postgres' },
      { id: 2, name: 'Analytics DB', engine: 'bigquery' },
    ];

    const mockClient = createMockClientWithResponse('get', mockDatabases);

    const result = await listDatabasesDefinition.handler(mockClient, {});

    expectMcpContent(result, mockDatabases);
    expect(mockClient.get).toHaveBeenCalledWith('/api/database');
    expect(mockClient.get).toHaveBeenCalledOnce();
  });

  it('should handle empty database list', async () => {
    const mockClient = createMockClientWithResponse('get', []);

    const result = await listDatabasesDefinition.handler(mockClient, {});

    expectMcpContent(result, []);
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'API error');

    await expect(listDatabasesDefinition.handler(mockClient, {})).rejects.toThrow('API error');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Forbidden', 403));

    await expect(listDatabasesDefinition.handler(mockClient, {})).rejects.toThrow('Forbidden');
  });

  it('should have correct tool definition metadata', () => {
    expect(listDatabasesDefinition.name).toBe('list_databases');
    expect(listDatabasesDefinition.description).toBe(
      'Get list of databases configured in Metabase',
    );
    expect(listDatabasesDefinition.inputSchema).toEqual({});
  });
});
