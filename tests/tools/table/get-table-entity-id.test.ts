import { TableIdInputSchema } from '@src/schemas/table';
import { getTableEntityIdDefinition } from '@src/tools/table/get-table-entity-id';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('getTableEntityId tool', () => {
  it('should return formatted MCP response with entity ID', async () => {
    const mockResult = { entity_id: 'abc123xyz' };
    const mockClient = createMockClientWithResponse('get', mockResult);

    const result = await getTableEntityIdDefinition.handler(mockClient, { id: 5 });

    expectMcpContent(result, mockResult);
    expect(mockClient.get).toHaveBeenCalledWith('/api/table/5/entity_id');
    expect(mockClient.get).toHaveBeenCalledOnce();
  });

  it('should get entity ID for different table', async () => {
    const mockResult = { entity_id: 'def456uvw' };
    const mockClient = createMockClientWithResponse('get', mockResult);

    await getTableEntityIdDefinition.handler(mockClient, { id: 10 });

    expect(mockClient.get).toHaveBeenCalledWith('/api/table/10/entity_id');
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'Table not found');

    await expect(getTableEntityIdDefinition.handler(mockClient, { id: 999 })).rejects.toThrow(
      'Table not found',
    );
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Unauthorized', 401));

    await expect(getTableEntityIdDefinition.handler(mockClient, { id: 1 })).rejects.toThrow(
      'Unauthorized',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(getTableEntityIdDefinition.name).toBe('get_table_entity_id');
    expect(getTableEntityIdDefinition.description).toBe(
      'Get the entity ID of a table in Metabase',
    );
    expect(getTableEntityIdDefinition.inputSchema).toEqual(TableIdInputSchema);
  });
});
