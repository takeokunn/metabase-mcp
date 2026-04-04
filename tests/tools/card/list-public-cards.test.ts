import { ListPublicCardsParamsSchema } from '@src/schemas/card';
import { listPublicCardsDefinition } from '@src/tools/card/list-public-cards';
import { describe, expect, it } from 'vitest';

import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('listPublicCards tool', () => {
  it('should return formatted MCP response with public cards', async () => {
    const mockResult = [
      { id: 1, name: 'Public Sales Report', public_uuid: 'abc-123' },
      { id: 2, name: 'Public Revenue Chart', public_uuid: 'def-456' },
    ];
    const mockClient = createMockClientWithResponse('get', mockResult);

    const result = await listPublicCardsDefinition.handler(mockClient, {});

    expectMcpContent(result, mockResult);
    expect(mockClient.get).toHaveBeenCalledWith('/api/card/public');
    expect(mockClient.get).toHaveBeenCalledOnce();
  });

  it('should return empty list when no public cards exist', async () => {
    const mockClient = createMockClientWithResponse('get', []);
    const result = await listPublicCardsDefinition.handler(mockClient, {});
    expectMcpContent(result, []);
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'Internal server error');
    await expect(listPublicCardsDefinition.handler(mockClient, {})).rejects.toThrow(
      'Internal server error',
    );
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Forbidden', 403));
    await expect(listPublicCardsDefinition.handler(mockClient, {})).rejects.toThrow('Forbidden');
  });

  it('should have correct tool definition metadata', () => {
    expect(listPublicCardsDefinition.name).toBe('list_public_cards');
    expect(listPublicCardsDefinition.inputSchema).toEqual(ListPublicCardsParamsSchema);
  });
});
