import { DeleteCardInputSchema } from '@src/schemas/card';
import { deleteCardDefinition } from '@src/tools/card/delete-card';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('deleteCard tool', () => {
  it('should return formatted MCP response after deleting card', async () => {
    const mockResult = { success: true };

    const mockClient = createMockClientWithResponse('delete', mockResult);

    const result = await deleteCardDefinition.handler(mockClient, { id: 1 });

    expectMcpContent(result, mockResult);
    expect(mockClient.delete).toHaveBeenCalledWith('/api/card/1');
    expect(mockClient.delete).toHaveBeenCalledOnce();
  });

  it('should delete card with different ID', async () => {
    const mockResult = { success: true };

    const mockClient = createMockClientWithResponse('delete', mockResult);

    const result = await deleteCardDefinition.handler(mockClient, { id: 42 });

    expectMcpContent(result, mockResult);
    expect(mockClient.delete).toHaveBeenCalledWith('/api/card/42');
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('delete', 'Card not found');

    await expect(deleteCardDefinition.handler(mockClient, { id: 999 })).rejects.toThrow(
      'Card not found',
    );
    expect(mockClient.delete).toHaveBeenCalledWith('/api/card/999');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('delete', createApiError('Forbidden', 403));

    await expect(deleteCardDefinition.handler(mockClient, { id: 1 })).rejects.toThrow('Forbidden');
  });

  it('should propagate unauthorized errors', async () => {
    const mockClient = createMockClientWithError('delete', createApiError('Unauthorized', 401));

    await expect(deleteCardDefinition.handler(mockClient, { id: 1 })).rejects.toThrow(
      'Unauthorized',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(deleteCardDefinition.name).toBe('delete_card');
    expect(deleteCardDefinition.description).toBe('Delete a card (saved question) from Metabase');
    expect(deleteCardDefinition.inputSchema).toEqual(DeleteCardInputSchema);
  });
});
