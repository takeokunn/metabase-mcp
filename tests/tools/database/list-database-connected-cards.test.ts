import { GetDatabaseParamsSchema } from '@src/schemas/database';
import { listDatabaseConnectedCardsDefinition } from '@src/tools/database/list-database-connected-cards';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('listDatabaseConnectedCards tool', () => {
  it('should return formatted MCP response with connected cards', async () => {
    const mockCards = [
      { id: 1, name: 'Revenue Dashboard', database_id: 1 },
      { id: 2, name: 'User Growth', database_id: 1 },
    ];

    const mockClient = createMockClientWithResponse('get', mockCards);

    const result = await listDatabaseConnectedCardsDefinition.handler(mockClient, { id: 1 });

    expectMcpContent(result, mockCards);
    expect(mockClient.get).toHaveBeenCalledWith('/api/database/1/questions');
    expect(mockClient.get).toHaveBeenCalledOnce();
  });

  it('should handle empty card list', async () => {
    const mockClient = createMockClientWithResponse('get', []);

    const result = await listDatabaseConnectedCardsDefinition.handler(mockClient, { id: 42 });

    expectMcpContent(result, []);
    expect(mockClient.get).toHaveBeenCalledWith('/api/database/42/questions');
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'Database not found');

    await expect(
      listDatabaseConnectedCardsDefinition.handler(mockClient, { id: 999 }),
    ).rejects.toThrow('Database not found');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Unauthorized', 401));

    await expect(
      listDatabaseConnectedCardsDefinition.handler(mockClient, { id: 1 }),
    ).rejects.toThrow('Unauthorized');
  });

  it('should have correct tool definition metadata', () => {
    expect(listDatabaseConnectedCardsDefinition.name).toBe('list_database_connected_cards');
    expect(listDatabaseConnectedCardsDefinition.description).toBe(
      'List all cards (questions) that are connected to a database in Metabase',
    );
    expect(listDatabaseConnectedCardsDefinition.inputSchema).toEqual(GetDatabaseParamsSchema);
  });
});
