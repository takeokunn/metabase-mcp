import { ExecuteQueryInputSchema } from '@src/schemas/dataset';
import { executeQueryDefinition } from '@src/tools/dataset/execute-query';
import { describe, expect, it } from 'vitest';

import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('executeQuery tool', () => {
  describe('MBQL query execution', () => {
    it('should execute MBQL query and return formatted MCP response', async () => {
      const mockQueryResult = {
        data: {
          rows: [
            [1, 'Product A', 100],
            [2, 'Product B', 200],
          ],
          cols: [
            { name: 'id', base_type: 'type/Integer' },
            { name: 'name', base_type: 'type/Text' },
            { name: 'price', base_type: 'type/Integer' },
          ],
        },
        row_count: 2,
        status: 'completed',
      };

      const mockClient = createMockClientWithResponse('post', mockQueryResult);

      const input = {
        database: 1,
        type: 'query' as const,
        query: {
          'source-table': 5,
          limit: 100,
        },
      };

      const result = await executeQueryDefinition.handler(mockClient, input);

      expectMcpContent(result, mockQueryResult);
      expect(mockClient.post).toHaveBeenCalledWith('/api/dataset', {
        database: 1,
        type: 'query',
        query: {
          'source-table': 5,
          limit: 100,
        },
      });
      expect(mockClient.post).toHaveBeenCalledOnce();
    });

    it('should handle MBQL query with aggregations', async () => {
      const mockQueryResult = {
        data: {
          rows: [[500]],
          cols: [{ name: 'count', base_type: 'type/Integer' }],
        },
        row_count: 1,
        status: 'completed',
      };

      const mockClient = createMockClientWithResponse('post', mockQueryResult);

      const input = {
        database: 1,
        type: 'query' as const,
        query: {
          'source-table': 10,
          aggregation: [['count']],
        },
      };

      const result = await executeQueryDefinition.handler(mockClient, input);

      expectMcpContent(result, mockQueryResult);
    });

    it('should handle empty MBQL query results', async () => {
      const mockQueryResult = {
        data: {
          rows: [],
          cols: [
            { name: 'id', base_type: 'type/Integer' },
            { name: 'name', base_type: 'type/Text' },
          ],
        },
        row_count: 0,
        status: 'completed',
      };

      const mockClient = createMockClientWithResponse('post', mockQueryResult);

      const input = {
        database: 1,
        type: 'query' as const,
        query: {
          'source-table': 5,
          filter: ['=', ['field', 1, null], 99999],
        },
      };

      const result = await executeQueryDefinition.handler(mockClient, input);

      expectMcpContent(result, mockQueryResult);
    });
  });

  describe('Native SQL query execution', () => {
    it('should execute native SQL query and return formatted MCP response', async () => {
      const mockQueryResult = {
        data: {
          rows: [
            [1, 'Alice', 'alice@example.com'],
            [2, 'Bob', 'bob@example.com'],
          ],
          cols: [
            { name: 'id', base_type: 'type/Integer' },
            { name: 'name', base_type: 'type/Text' },
            { name: 'email', base_type: 'type/Text' },
          ],
        },
        row_count: 2,
        status: 'completed',
      };

      const mockClient = createMockClientWithResponse('post', mockQueryResult);

      const input = {
        database: 1,
        type: 'native' as const,
        native: {
          query: 'SELECT id, name, email FROM users LIMIT 10',
        },
      };

      const result = await executeQueryDefinition.handler(mockClient, input);

      expectMcpContent(result, mockQueryResult);
      expect(mockClient.post).toHaveBeenCalledWith('/api/dataset', {
        database: 1,
        type: 'native',
        native: {
          query: 'SELECT id, name, email FROM users LIMIT 10',
        },
      });
    });

    it('should execute native SQL query with template tags', async () => {
      const mockQueryResult = {
        data: {
          rows: [[1, 'Alice']],
          cols: [
            { name: 'id', base_type: 'type/Integer' },
            { name: 'name', base_type: 'type/Text' },
          ],
        },
        row_count: 1,
        status: 'completed',
      };

      const mockClient = createMockClientWithResponse('post', mockQueryResult);

      const input = {
        database: 1,
        type: 'native' as const,
        native: {
          query: 'SELECT id, name FROM users WHERE id = {{user_id}}',
          'template-tags': {
            user_id: {
              name: 'user_id',
              type: 'number',
              value: 1,
            },
          },
        },
      };

      const result = await executeQueryDefinition.handler(mockClient, input);

      expect(mockClient.post).toHaveBeenCalledWith('/api/dataset', {
        database: 1,
        type: 'native',
        native: {
          query: 'SELECT id, name FROM users WHERE id = {{user_id}}',
          'template-tags': {
            user_id: {
              name: 'user_id',
              type: 'number',
              value: 1,
            },
          },
        },
      });
      expectMcpContent(result, mockQueryResult);
    });

    it('should handle empty native SQL query results', async () => {
      const mockQueryResult = {
        data: {
          rows: [],
          cols: [{ name: 'id', base_type: 'type/Integer' }],
        },
        row_count: 0,
        status: 'completed',
      };

      const mockClient = createMockClientWithResponse('post', mockQueryResult);

      const input = {
        database: 1,
        type: 'native' as const,
        native: {
          query: 'SELECT * FROM users WHERE 1 = 0',
        },
      };

      const result = await executeQueryDefinition.handler(mockClient, input);

      expectMcpContent(result, mockQueryResult);
    });
  });

  describe('Error handling', () => {
    it('should propagate query execution errors', async () => {
      const mockClient = createMockClientWithError('post', 'Query execution failed');

      const input = {
        database: 1,
        type: 'native' as const,
        native: {
          query: 'SELECT * FROM nonexistent_table',
        },
      };

      await expect(executeQueryDefinition.handler(mockClient, input)).rejects.toThrow(
        'Query execution failed',
      );
    });

    it('should propagate database connection errors', async () => {
      const mockClient = createMockClientWithError(
        'post',
        createApiError('Database connection failed', 500),
      );

      const input = {
        database: 999,
        type: 'native' as const,
        native: {
          query: 'SELECT 1',
        },
      };

      await expect(executeQueryDefinition.handler(mockClient, input)).rejects.toThrow(
        'Database connection failed',
      );
    });

    it('should propagate authentication errors', async () => {
      const mockClient = createMockClientWithError('post', createApiError('Unauthorized', 401));

      const input = {
        database: 1,
        type: 'native' as const,
        native: {
          query: 'SELECT 1',
        },
      };

      await expect(executeQueryDefinition.handler(mockClient, input)).rejects.toThrow(
        'Unauthorized',
      );
    });

    it('should propagate permission errors', async () => {
      const mockClient = createMockClientWithError(
        'post',
        createApiError('You do not have permission to run this query', 403),
      );

      const input = {
        database: 1,
        type: 'native' as const,
        native: {
          query: 'DROP TABLE users',
        },
      };

      await expect(executeQueryDefinition.handler(mockClient, input)).rejects.toThrow(
        'You do not have permission to run this query',
      );
    });
  });

  describe('Tool definition metadata', () => {
    it('should have correct tool definition metadata', () => {
      expect(executeQueryDefinition.name).toBe('execute_query');
      expect(executeQueryDefinition.description).toBe(
        'Execute an MBQL or native SQL query against a database. For MBQL queries, use type="query" and provide query object. For native SQL, use type="native" and provide native.query string.',
      );
      expect(executeQueryDefinition.inputSchema).toEqual(ExecuteQueryInputSchema);
    });
  });
});
