import { GetDatabaseParamsSchema } from '@src/schemas/database';
import { getDatabaseMetadataDefinition } from '@src/tools/database/get-database-metadata';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('getDatabaseMetadata tool', () => {
  it('should return formatted MCP response with database metadata', async () => {
    const mockMetadata = {
      id: 1,
      name: 'Production DB',
      tables: [
        {
          id: 1,
          name: 'users',
          fields: [
            { id: 1, name: 'id', base_type: 'type/Integer' },
            { id: 2, name: 'email', base_type: 'type/Text' },
          ],
        },
        {
          id: 2,
          name: 'orders',
          fields: [
            { id: 3, name: 'id', base_type: 'type/Integer' },
            { id: 4, name: 'user_id', base_type: 'type/Integer' },
          ],
        },
      ],
    };

    const mockClient = createMockClientWithResponse('get', mockMetadata);

    const result = await getDatabaseMetadataDefinition.handler(mockClient, { id: 1 });

    expectMcpContent(result, mockMetadata);
    expect(mockClient.get).toHaveBeenCalledWith('/api/database/1/metadata');
    expect(mockClient.get).toHaveBeenCalledOnce();
  });

  it('should handle database with no tables', async () => {
    const mockMetadata = {
      id: 42,
      name: 'Empty DB',
      tables: [],
    };

    const mockClient = createMockClientWithResponse('get', mockMetadata);

    const result = await getDatabaseMetadataDefinition.handler(mockClient, { id: 42 });

    expectMcpContent(result, mockMetadata);
    expect(mockClient.get).toHaveBeenCalledWith('/api/database/42/metadata');
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'Database not found');

    await expect(getDatabaseMetadataDefinition.handler(mockClient, { id: 999 })).rejects.toThrow(
      'Database not found',
    );
    expect(mockClient.get).toHaveBeenCalledWith('/api/database/999/metadata');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Forbidden', 403));

    await expect(getDatabaseMetadataDefinition.handler(mockClient, { id: 1 })).rejects.toThrow(
      'Forbidden',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(getDatabaseMetadataDefinition.name).toBe('get_database_metadata');
    expect(getDatabaseMetadataDefinition.description).toBe(
      'Get database metadata including tables and fields from Metabase',
    );
    expect(getDatabaseMetadataDefinition.inputSchema).toEqual(GetDatabaseParamsSchema);
  });
});
