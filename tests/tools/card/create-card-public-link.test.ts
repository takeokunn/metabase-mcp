import { CreateCardPublicLinkInputSchema } from '@src/schemas/card';
import { createCardPublicLinkDefinition } from '@src/tools/card/create-card-public-link';
import { describe, expect, it } from 'vitest';

import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('createCardPublicLink tool', () => {
  const baseInput = { id: 1 };

  it('should return formatted MCP response with public link UUID', async () => {
    const mockResponse = { uuid: '550e8400-e29b-41d4-a716-446655440000' };
    const mockClient = createMockClientWithResponse('post', mockResponse);

    const result = await createCardPublicLinkDefinition.handler(mockClient, baseInput);

    expectMcpContent(result, mockResponse);
    expect(mockClient.post).toHaveBeenCalledWith('/api/card/1/public_link', {});
    expect(mockClient.post).toHaveBeenCalledOnce();
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('post', 'Card not found');
    await expect(createCardPublicLinkDefinition.handler(mockClient, baseInput)).rejects.toThrow(
      'Card not found',
    );
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('post', createApiError('Forbidden', 403));
    await expect(createCardPublicLinkDefinition.handler(mockClient, baseInput)).rejects.toThrow(
      'Forbidden',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(createCardPublicLinkDefinition.name).toBe('create_card_public_link');
    expect(createCardPublicLinkDefinition.inputSchema).toEqual(CreateCardPublicLinkInputSchema);
  });
});
