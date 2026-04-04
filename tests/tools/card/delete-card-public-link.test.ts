import { DeleteCardPublicLinkInputSchema } from '@src/schemas/card';
import { deleteCardPublicLinkDefinition } from '@src/tools/card/delete-card-public-link';
import { describe, expect, it } from 'vitest';

import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('deleteCardPublicLink tool', () => {
  const baseInput = { id: 1 };

  it('should return formatted MCP response on successful deletion', async () => {
    const mockResponse = { success: true };
    const mockClient = createMockClientWithResponse('delete', mockResponse);

    const result = await deleteCardPublicLinkDefinition.handler(mockClient, baseInput);

    expectMcpContent(result, mockResponse);
    expect(mockClient.delete).toHaveBeenCalledWith('/api/card/1/public_link');
    expect(mockClient.delete).toHaveBeenCalledOnce();
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('delete', 'Card not found');
    await expect(deleteCardPublicLinkDefinition.handler(mockClient, baseInput)).rejects.toThrow(
      'Card not found',
    );
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('delete', createApiError('Unauthorized', 401));
    await expect(deleteCardPublicLinkDefinition.handler(mockClient, baseInput)).rejects.toThrow(
      'Unauthorized',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(deleteCardPublicLinkDefinition.name).toBe('delete_card_public_link');
    expect(deleteCardPublicLinkDefinition.inputSchema).toEqual(DeleteCardPublicLinkInputSchema);
  });
});
