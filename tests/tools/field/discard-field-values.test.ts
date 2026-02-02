import type { MetabaseClient } from '@src/client';
import { DiscardFieldValuesInputSchema } from '@src/schemas/field';
import { discardFieldValuesDefinition } from '@src/tools/field/discard-field-values';
import { describe, expect, it, vi } from 'vitest';

describe('discardFieldValues tool', () => {
  it('should return formatted MCP response after discarding field values', async () => {
    const mockResponse = {
      success: true,
    };

    const mockClient = {
      post: vi.fn().mockResolvedValue(mockResponse),
    } as unknown as MetabaseClient;

    const result = await discardFieldValuesDefinition.handler(mockClient, { id: 1 });

    expect(result.content).toHaveLength(1);
    expect(result.content[0].type).toBe('text');
    expect(JSON.parse((result.content[0] as { text: string }).text)).toEqual(mockResponse);
    expect(mockClient.post).toHaveBeenCalledWith('/api/field/1/discard_values');
    expect(mockClient.post).toHaveBeenCalledOnce();
  });

  it('should handle discard for different field IDs', async () => {
    const mockResponse = {
      success: true,
      message: 'Field values discarded',
    };

    const mockClient = {
      post: vi.fn().mockResolvedValue(mockResponse),
    } as unknown as MetabaseClient;

    const result = await discardFieldValuesDefinition.handler(mockClient, { id: 42 });

    expect(result.content[0].type).toBe('text');
    expect(JSON.parse((result.content[0] as { text: string }).text)).toEqual(mockResponse);
    expect(mockClient.post).toHaveBeenCalledWith('/api/field/42/discard_values');
  });

  it('should handle empty response', async () => {
    const mockResponse = {};

    const mockClient = {
      post: vi.fn().mockResolvedValue(mockResponse),
    } as unknown as MetabaseClient;

    const result = await discardFieldValuesDefinition.handler(mockClient, { id: 100 });

    expect(result.content[0].type).toBe('text');
    expect(JSON.parse((result.content[0] as { text: string }).text)).toEqual(mockResponse);
    expect(mockClient.post).toHaveBeenCalledWith('/api/field/100/discard_values');
  });

  it('should propagate client errors', async () => {
    const mockClient = {
      post: vi.fn().mockRejectedValue(new Error('Field not found')),
    } as unknown as MetabaseClient;

    await expect(discardFieldValuesDefinition.handler(mockClient, { id: 999 })).rejects.toThrow(
      'Field not found',
    );
    expect(mockClient.post).toHaveBeenCalledWith('/api/field/999/discard_values');
  });

  it('should propagate API errors with status codes', async () => {
    const apiError = new Error('Forbidden');
    (apiError as Error & { status?: number }).status = 403;

    const mockClient = {
      post: vi.fn().mockRejectedValue(apiError),
    } as unknown as MetabaseClient;

    await expect(discardFieldValuesDefinition.handler(mockClient, { id: 1 })).rejects.toThrow(
      'Forbidden',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(discardFieldValuesDefinition.name).toBe('discard_field_values');
    expect(discardFieldValuesDefinition.description).toBe(
      'Discard the cached values for a field in Metabase',
    );
    expect(discardFieldValuesDefinition.inputSchema).toEqual(DiscardFieldValuesInputSchema);
  });
});
