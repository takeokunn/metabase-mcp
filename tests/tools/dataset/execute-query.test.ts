import type { MetabaseClient } from '@src/client';
import { ExecuteQueryInputSchema } from '@src/schemas/dataset';
import { executeQueryDefinition } from '@src/tools/dataset/execute-query';
import { describe, expect, it, vi } from 'vitest';

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

      const mockClient = {
        post: vi.fn().mockResolvedValue(mockQueryResult),
      } as unknown as MetabaseClient;

      const input = {
        database: 1,
        type: 'query' as const,
        query: {
          'source-table': 5,
          limit: 100,
        },
      };

      const result = await executeQueryDefinition.handler(mockClient, input);

      expect(result.content).toHaveLength(1);
      expect(result.content[0].type).toBe('text');
      expect(JSON.parse((result.content[0] as { text: string }).text)).toEqual(mockQueryResult);
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

      const mockClient = {
        post: vi.fn().mockResolvedValue(mockQueryResult),
      } as unknown as MetabaseClient;

      const input = {
        database: 1,
        type: 'query' as const,
        query: {
          'source-table': 10,
          aggregation: [['count']],
        },
      };

      const result = await executeQueryDefinition.handler(mockClient, input);

      const parsedResult = JSON.parse((result.content[0] as { text: string }).text);
      expect(parsedResult.data.rows[0][0]).toBe(500);
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

      const mockClient = {
        post: vi.fn().mockResolvedValue(mockQueryResult),
      } as unknown as MetabaseClient;

      const input = {
        database: 1,
        type: 'query' as const,
        query: {
          'source-table': 5,
          filter: ['=', ['field', 1, null], 99999],
        },
      };

      const result = await executeQueryDefinition.handler(mockClient, input);

      const parsedResult = JSON.parse((result.content[0] as { text: string }).text);
      expect(parsedResult.row_count).toBe(0);
      expect(parsedResult.data.rows).toEqual([]);
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

      const mockClient = {
        post: vi.fn().mockResolvedValue(mockQueryResult),
      } as unknown as MetabaseClient;

      const input = {
        database: 1,
        type: 'native' as const,
        native: {
          query: 'SELECT id, name, email FROM users LIMIT 10',
        },
      };

      const result = await executeQueryDefinition.handler(mockClient, input);

      expect(result.content).toHaveLength(1);
      expect(result.content[0].type).toBe('text');
      expect(JSON.parse((result.content[0] as { text: string }).text)).toEqual(mockQueryResult);
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

      const mockClient = {
        post: vi.fn().mockResolvedValue(mockQueryResult),
      } as unknown as MetabaseClient;

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
      const parsedResult = JSON.parse((result.content[0] as { text: string }).text);
      expect(parsedResult.row_count).toBe(1);
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

      const mockClient = {
        post: vi.fn().mockResolvedValue(mockQueryResult),
      } as unknown as MetabaseClient;

      const input = {
        database: 1,
        type: 'native' as const,
        native: {
          query: 'SELECT * FROM users WHERE 1 = 0',
        },
      };

      const result = await executeQueryDefinition.handler(mockClient, input);

      const parsedResult = JSON.parse((result.content[0] as { text: string }).text);
      expect(parsedResult.row_count).toBe(0);
    });
  });

  describe('Error handling', () => {
    it('should propagate query execution errors', async () => {
      const mockClient = {
        post: vi.fn().mockRejectedValue(new Error('Query execution failed')),
      } as unknown as MetabaseClient;

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
      const apiError = new Error('Database connection failed');
      (apiError as Error & { status?: number }).status = 500;

      const mockClient = {
        post: vi.fn().mockRejectedValue(apiError),
      } as unknown as MetabaseClient;

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
      const apiError = new Error('Unauthorized');
      (apiError as Error & { status?: number }).status = 401;

      const mockClient = {
        post: vi.fn().mockRejectedValue(apiError),
      } as unknown as MetabaseClient;

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
      const apiError = new Error('You do not have permission to run this query');
      (apiError as Error & { status?: number }).status = 403;

      const mockClient = {
        post: vi.fn().mockRejectedValue(apiError),
      } as unknown as MetabaseClient;

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
