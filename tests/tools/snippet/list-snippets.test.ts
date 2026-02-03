import { ListSnippetsParamsSchema } from '@src/schemas/snippet';
import { listSnippetsDefinition } from '@src/tools/snippet/list-snippets';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('listSnippets tool', () => {
  it('should return formatted MCP response with snippets', async () => {
    const mockSnippets = [
      {
        id: 1,
        name: 'Date Filter',
        content: 'WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)',
        creator_id: 1,
        archived: false,
      },
      {
        id: 2,
        name: 'User Join',
        content: 'JOIN users u ON u.id = orders.user_id',
        creator_id: 1,
        archived: false,
      },
    ];

    const mockClient = createMockClientWithResponse('get', mockSnippets);

    const result = await listSnippetsDefinition.handler(mockClient, {});

    expectMcpContent(result, mockSnippets);
    expect(mockClient.get).toHaveBeenCalledWith('/api/native-query-snippet', undefined);
    expect(mockClient.get).toHaveBeenCalledOnce();
  });

  it('should filter by archived status when provided', async () => {
    const mockSnippets = [
      {
        id: 3,
        name: 'Old Filter',
        content: 'WHERE status = "inactive"',
        archived: true,
      },
    ];

    const mockClient = createMockClientWithResponse('get', mockSnippets);

    const result = await listSnippetsDefinition.handler(mockClient, { archived: true });

    expectMcpContent(result, mockSnippets);
    expect(mockClient.get).toHaveBeenCalledWith('/api/native-query-snippet', { archived: true });
  });

  it('should handle empty snippets list', async () => {
    const mockClient = createMockClientWithResponse('get', []);

    const result = await listSnippetsDefinition.handler(mockClient, {});

    expectMcpContent(result, []);
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'API error');

    await expect(listSnippetsDefinition.handler(mockClient, {})).rejects.toThrow('API error');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Unauthorized', 401));

    await expect(listSnippetsDefinition.handler(mockClient, {})).rejects.toThrow('Unauthorized');
  });

  it('should have correct tool definition metadata', () => {
    expect(listSnippetsDefinition.name).toBe('list_snippets');
    expect(listSnippetsDefinition.description).toBe(
      'Get list of native query snippets in Metabase, optionally filtered by archived status',
    );
    expect(listSnippetsDefinition.inputSchema).toEqual(ListSnippetsParamsSchema);
  });
});
