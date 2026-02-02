import type { MetabaseClient } from '@src/client';
import { DeleteCardInputSchema } from '@src/schemas/card';
import { deleteCardDefinition } from '@src/tools/card/delete-card';
import { describe, expect, it, vi } from 'vitest';

describe('deleteCard tool', () => {
  it('should return formatted MCP response after deleting card', async () => {
    const mockResult = { success: true };

    const mockClient = {
      delete: vi.fn().mockResolvedValue(mockResult),
    } as unknown as MetabaseClient;

    const result = await deleteCardDefinition.handler(mockClient, { id: 1 });

    expect(result.content).toHaveLength(1);
    expect(result.content[0].type).toBe('text');
    expect(JSON.parse((result.content[0] as { text: string }).text)).toEqual(mockResult);
    expect(mockClient.delete).toHaveBeenCalledWith('/api/card/1');
    expect(mockClient.delete).toHaveBeenCalledOnce();
  });

  it('should delete card with different ID', async () => {
    const mockResult = { success: true };

    const mockClient = {
      delete: vi.fn().mockResolvedValue(mockResult),
    } as unknown as MetabaseClient;

    const result = await deleteCardDefinition.handler(mockClient, { id: 42 });

    expect(result.content[0].type).toBe('text');
    expect(JSON.parse((result.content[0] as { text: string }).text)).toEqual(mockResult);
    expect(mockClient.delete).toHaveBeenCalledWith('/api/card/42');
  });

  it('should propagate client errors', async () => {
    const mockClient = {
      delete: vi.fn().mockRejectedValue(new Error('Card not found')),
    } as unknown as MetabaseClient;

    await expect(deleteCardDefinition.handler(mockClient, { id: 999 })).rejects.toThrow(
      'Card not found',
    );
    expect(mockClient.delete).toHaveBeenCalledWith('/api/card/999');
  });

  it('should propagate API errors with status codes', async () => {
    const apiError = new Error('Forbidden');
    (apiError as Error & { status?: number }).status = 403;

    const mockClient = {
      delete: vi.fn().mockRejectedValue(apiError),
    } as unknown as MetabaseClient;

    await expect(deleteCardDefinition.handler(mockClient, { id: 1 })).rejects.toThrow('Forbidden');
  });

  it('should propagate unauthorized errors', async () => {
    const apiError = new Error('Unauthorized');
    (apiError as Error & { status?: number }).status = 401;

    const mockClient = {
      delete: vi.fn().mockRejectedValue(apiError),
    } as unknown as MetabaseClient;

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
