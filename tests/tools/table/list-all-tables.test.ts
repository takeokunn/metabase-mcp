import { listAllTablesDefinition } from '@src/tools/table/list-all-tables';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('listAllTables tool', () => {
  it('should return formatted MCP response with all tables', async () => {
    const mockTables = [
      { id: 1, name: 'orders', db_id: 1, display_name: 'Orders' },
      { id: 2, name: 'products', db_id: 1, display_name: 'Products' },
      { id: 3, name: 'users', db_id: 2, display_name: 'Users' },
    ];

    const mockClient = createMockClientWithResponse('get', mockTables);

    const result = await listAllTablesDefinition.handler(mockClient, {});

    expectMcpContent(result, mockTables);
    expect(mockClient.get).toHaveBeenCalledWith('/api/table');
    expect(mockClient.get).toHaveBeenCalledOnce();
  });

  it('should handle empty table list', async () => {
    const mockClient = createMockClientWithResponse('get', []);

    const result = await listAllTablesDefinition.handler(mockClient, {});

    expectMcpContent(result, []);
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'API error');

    await expect(listAllTablesDefinition.handler(mockClient, {})).rejects.toThrow('API error');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Unauthorized', 401));

    await expect(listAllTablesDefinition.handler(mockClient, {})).rejects.toThrow('Unauthorized');
  });

  it('should have correct tool definition metadata', () => {
    expect(listAllTablesDefinition.name).toBe('list_all_tables');
    expect(listAllTablesDefinition.description).toBe(
      'List all tables across all databases in Metabase',
    );
  });
});
