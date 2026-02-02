import type { MetabaseClient } from '@src/client';
import { GetDatabaseParamsSchema } from '@src/schemas/database';
import { listDatabaseSchemasDefinition } from '@src/tools/database/list-database-schemas';
import { describe, expect, it, vi } from 'vitest';

describe('listDatabaseSchemas tool', () => {
  it('should return formatted MCP response with schemas', async () => {
    const mockSchemas = ['public', 'analytics', 'reporting'];

    const mockClient = {
      get: vi.fn().mockResolvedValue(mockSchemas),
    } as unknown as MetabaseClient;

    const result = await listDatabaseSchemasDefinition.handler(mockClient, { id: 1 });

    expect(result.content).toHaveLength(1);
    expect(result.content[0].type).toBe('text');
    expect(JSON.parse((result.content[0] as { text: string }).text)).toEqual(mockSchemas);
    expect(mockClient.get).toHaveBeenCalledWith('/api/database/1/schemas');
    expect(mockClient.get).toHaveBeenCalledOnce();
  });

  it('should handle empty schema list', async () => {
    const mockSchemas: string[] = [];

    const mockClient = {
      get: vi.fn().mockResolvedValue(mockSchemas),
    } as unknown as MetabaseClient;

    const result = await listDatabaseSchemasDefinition.handler(mockClient, { id: 42 });

    expect(result.content[0].type).toBe('text');
    expect(JSON.parse((result.content[0] as { text: string }).text)).toEqual([]);
    expect(mockClient.get).toHaveBeenCalledWith('/api/database/42/schemas');
  });

  it('should handle single schema', async () => {
    const mockSchemas = ['public'];

    const mockClient = {
      get: vi.fn().mockResolvedValue(mockSchemas),
    } as unknown as MetabaseClient;

    const result = await listDatabaseSchemasDefinition.handler(mockClient, { id: 5 });

    expect(JSON.parse((result.content[0] as { text: string }).text)).toEqual(['public']);
    expect(mockClient.get).toHaveBeenCalledWith('/api/database/5/schemas');
  });

  it('should propagate client errors', async () => {
    const mockClient = {
      get: vi.fn().mockRejectedValue(new Error('Database not found')),
    } as unknown as MetabaseClient;

    await expect(listDatabaseSchemasDefinition.handler(mockClient, { id: 999 })).rejects.toThrow(
      'Database not found',
    );
    expect(mockClient.get).toHaveBeenCalledWith('/api/database/999/schemas');
  });

  it('should propagate API errors with status codes', async () => {
    const apiError = new Error('Unauthorized');
    (apiError as Error & { status?: number }).status = 401;

    const mockClient = {
      get: vi.fn().mockRejectedValue(apiError),
    } as unknown as MetabaseClient;

    await expect(listDatabaseSchemasDefinition.handler(mockClient, { id: 1 })).rejects.toThrow(
      'Unauthorized',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(listDatabaseSchemasDefinition.name).toBe('list_database_schemas');
    expect(listDatabaseSchemasDefinition.description).toBe(
      'List all schemas in a database from Metabase',
    );
    expect(listDatabaseSchemasDefinition.inputSchema).toEqual(GetDatabaseParamsSchema);
  });
});
