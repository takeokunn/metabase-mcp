import type { MetabaseClient } from '@src/client';
import { ExportQueryInputSchema } from '@src/schemas/dataset';
import { exportQueryDefinition } from '@src/tools/dataset/export-query';
import { describe, expect, it, vi } from 'vitest';

describe('exportQuery tool', () => {
  describe('CSV export', () => {
    it('should export MBQL query results as CSV', async () => {
      const mockCsvData = 'id,name,value\n1,Product A,100\n2,Product B,200';

      const mockClient = {
        post: vi.fn().mockResolvedValue(mockCsvData),
      } as unknown as MetabaseClient;

      const input = {
        database: 1,
        type: 'query' as const,
        query: {
          'source-table': 1,
        },
        format: 'csv' as const,
      };

      const result = await exportQueryDefinition.handler(mockClient, input);

      expect(result.content).toHaveLength(1);
      expect(result.content[0].type).toBe('text');
      expect(JSON.parse((result.content[0] as { text: string }).text)).toEqual(mockCsvData);
      expect(mockClient.post).toHaveBeenCalledWith('/api/dataset/csv', {
        database: 1,
        type: 'query',
        query: { 'source-table': 1 },
      });
      expect(mockClient.post).toHaveBeenCalledOnce();
    });

    it('should export native SQL query results as CSV', async () => {
      const mockCsvData = 'count\n42';

      const mockClient = {
        post: vi.fn().mockResolvedValue(mockCsvData),
      } as unknown as MetabaseClient;

      const input = {
        database: 1,
        type: 'native' as const,
        native: {
          query: 'SELECT COUNT(*) as count FROM users',
        },
        format: 'csv' as const,
      };

      const result = await exportQueryDefinition.handler(mockClient, input);

      expect(result.content[0].type).toBe('text');
      expect(JSON.parse((result.content[0] as { text: string }).text)).toEqual(mockCsvData);
      expect(mockClient.post).toHaveBeenCalledWith('/api/dataset/csv', {
        database: 1,
        type: 'native',
        native: { query: 'SELECT COUNT(*) as count FROM users' },
      });
    });
  });

  describe('JSON export', () => {
    it('should export MBQL query results as JSON', async () => {
      const mockJsonData = [
        { id: 1, name: 'Product A', value: 100 },
        { id: 2, name: 'Product B', value: 200 },
      ];

      const mockClient = {
        post: vi.fn().mockResolvedValue(mockJsonData),
      } as unknown as MetabaseClient;

      const input = {
        database: 1,
        type: 'query' as const,
        query: {
          'source-table': 2,
          fields: [
            ['field', 1],
            ['field', 2],
            ['field', 3],
          ],
        },
        format: 'json' as const,
      };

      const result = await exportQueryDefinition.handler(mockClient, input);

      expect(result.content[0].type).toBe('text');
      expect(JSON.parse((result.content[0] as { text: string }).text)).toEqual(mockJsonData);
      expect(mockClient.post).toHaveBeenCalledWith('/api/dataset/json', {
        database: 1,
        type: 'query',
        query: input.query,
      });
    });
  });

  describe('XLSX export', () => {
    it('should export query results as XLSX', async () => {
      const mockXlsxData = Buffer.from('xlsx binary data').toString('base64');

      const mockClient = {
        post: vi.fn().mockResolvedValue(mockXlsxData),
      } as unknown as MetabaseClient;

      const input = {
        database: 1,
        type: 'query' as const,
        query: {
          'source-table': 1,
        },
        format: 'xlsx' as const,
      };

      const result = await exportQueryDefinition.handler(mockClient, input);

      expect(result.content[0].type).toBe('text');
      expect(mockClient.post).toHaveBeenCalledWith('/api/dataset/xlsx', {
        database: 1,
        type: 'query',
        query: { 'source-table': 1 },
      });
    });
  });

  describe('native queries with template tags', () => {
    it('should handle native query with template tags', async () => {
      const mockJsonData = [{ user_count: 15 }];

      const mockClient = {
        post: vi.fn().mockResolvedValue(mockJsonData),
      } as unknown as MetabaseClient;

      const input = {
        database: 1,
        type: 'native' as const,
        native: {
          query: 'SELECT COUNT(*) as user_count FROM users WHERE status = {{status}}',
          'template-tags': {
            status: {
              name: 'status',
              type: 'text',
              default: 'active',
            },
          },
        },
        format: 'json' as const,
      };

      const result = await exportQueryDefinition.handler(mockClient, input);

      expect(result.content[0].type).toBe('text');
      expect(JSON.parse((result.content[0] as { text: string }).text)).toEqual(mockJsonData);
      expect(mockClient.post).toHaveBeenCalledWith('/api/dataset/json', {
        database: 1,
        type: 'native',
        native: input.native,
      });
    });
  });

  describe('error handling', () => {
    it('should propagate client errors', async () => {
      const mockClient = {
        post: vi.fn().mockRejectedValue(new Error('Query execution failed')),
      } as unknown as MetabaseClient;

      const input = {
        database: 1,
        type: 'query' as const,
        query: { 'source-table': 1 },
        format: 'csv' as const,
      };

      await expect(exportQueryDefinition.handler(mockClient, input)).rejects.toThrow(
        'Query execution failed',
      );
    });

    it('should propagate API errors with status codes', async () => {
      const apiError = new Error('Bad Request');
      (apiError as Error & { status?: number }).status = 400;

      const mockClient = {
        post: vi.fn().mockRejectedValue(apiError),
      } as unknown as MetabaseClient;

      const input = {
        database: 1,
        type: 'query' as const,
        query: { 'source-table': 1 },
        format: 'json' as const,
      };

      await expect(exportQueryDefinition.handler(mockClient, input)).rejects.toThrow('Bad Request');
    });

    it('should propagate database not found errors', async () => {
      const apiError = new Error('Database not found');
      (apiError as Error & { status?: number }).status = 404;

      const mockClient = {
        post: vi.fn().mockRejectedValue(apiError),
      } as unknown as MetabaseClient;

      const input = {
        database: 999,
        type: 'native' as const,
        native: { query: 'SELECT 1' },
        format: 'csv' as const,
      };

      await expect(exportQueryDefinition.handler(mockClient, input)).rejects.toThrow(
        'Database not found',
      );
    });
  });

  describe('tool metadata', () => {
    it('should have correct tool definition metadata', () => {
      expect(exportQueryDefinition.name).toBe('export_query');
      expect(exportQueryDefinition.description).toBe(
        'Export query results in CSV, JSON, or XLSX format. For MBQL queries, use type="query" and provide query object. For native SQL, use type="native" and provide native.query string.',
      );
      expect(exportQueryDefinition.inputSchema).toEqual(ExportQueryInputSchema);
    });
  });
});
