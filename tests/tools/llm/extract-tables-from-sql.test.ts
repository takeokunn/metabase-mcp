import { extractTablesFromSqlDefinition } from '@src/tools/llm/extract-tables-from-sql';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('extractTablesFromSql tool', () => {
  const input = {
    database_id: 1,
    sql: 'SELECT * FROM orders JOIN users ON orders.user_id = users.id',
  };

  it('should return formatted MCP response', async () => {
    const mockResult = { tables: ['orders', 'users'] };
    const mockClient = createMockClientWithResponse('post', mockResult);
    const result = await extractTablesFromSqlDefinition.handler(mockClient, input);
    expectMcpContent(result, mockResult);
  });

  it('should have EE annotation in description', () => {
    expect(extractTablesFromSqlDefinition.description).toContain('[Requires Metabase Pro]');
  });

  it('should call correct endpoint', async () => {
    const mockClient = createMockClientWithResponse('post', {});
    await extractTablesFromSqlDefinition.handler(mockClient, input);
    expect(mockClient.post).toHaveBeenCalledWith('/api/llm/extract-sources', {
      database_id: input.database_id,
      sql: input.sql,
    });
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('post', 'API error');
    await expect(extractTablesFromSqlDefinition.handler(mockClient, input)).rejects.toThrow(
      'API error',
    );
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('post', createApiError('Forbidden', 403));
    await expect(extractTablesFromSqlDefinition.handler(mockClient, input)).rejects.toThrow(
      'Forbidden',
    );
  });
});
