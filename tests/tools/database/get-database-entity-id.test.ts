import { GetDatabaseParamsSchema } from '@src/schemas/database';
import { getDatabaseEntityIdDefinition } from '@src/tools/database/get-database-entity-id';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('getDatabaseEntityId tool', () => {
  it('should return formatted MCP response with entity ID', async () => {
    const mockResponse = { entity_id: 'abc123XYZ' };

    const mockClient = createMockClientWithResponse('get', mockResponse);

    const result = await getDatabaseEntityIdDefinition.handler(mockClient, { id: 1 });

    expectMcpContent(result, mockResponse);
    expect(mockClient.get).toHaveBeenCalledWith('/api/database/1/entity_id');
    expect(mockClient.get).toHaveBeenCalledOnce();
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'Database not found');

    await expect(getDatabaseEntityIdDefinition.handler(mockClient, { id: 999 })).rejects.toThrow(
      'Database not found',
    );
    expect(mockClient.get).toHaveBeenCalledWith('/api/database/999/entity_id');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Unauthorized', 401));

    await expect(getDatabaseEntityIdDefinition.handler(mockClient, { id: 1 })).rejects.toThrow(
      'Unauthorized',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(getDatabaseEntityIdDefinition.name).toBe('get_database_entity_id');
    expect(getDatabaseEntityIdDefinition.description).toBe(
      'Get the entity ID of a database in Metabase (used for serialization)',
    );
    expect(getDatabaseEntityIdDefinition.inputSchema).toEqual(GetDatabaseParamsSchema);
  });
});
