import type { MetabaseClient } from '@src/client';
import { RescanFieldValuesInputSchema } from '@src/schemas/field';
import { rescanFieldValuesDefinition } from '@src/tools/field/rescan-field-values';
import { describe, expect, it, vi } from 'vitest';

describe('rescanFieldValues tool', () => {
  it('should return formatted MCP response after triggering rescan', async () => {
    const mockResponse = {
      success: true,
    };

    const mockClient = {
      post: vi.fn().mockResolvedValue(mockResponse),
    } as unknown as MetabaseClient;

    const result = await rescanFieldValuesDefinition.handler(mockClient, { id: 1 });

    expect(result.content).toHaveLength(1);
    expect(result.content[0].type).toBe('text');
    expect(JSON.parse((result.content[0] as { text: string }).text)).toEqual(mockResponse);
    expect(mockClient.post).toHaveBeenCalledWith('/api/field/1/rescan_values');
    expect(mockClient.post).toHaveBeenCalledOnce();
  });

  it('should handle rescan for different field IDs', async () => {
    const mockResponse = {
      success: true,
      message: 'Rescan scheduled',
    };

    const mockClient = {
      post: vi.fn().mockResolvedValue(mockResponse),
    } as unknown as MetabaseClient;

    const result = await rescanFieldValuesDefinition.handler(mockClient, { id: 42 });

    expect(result.content[0].type).toBe('text');
    expect(JSON.parse((result.content[0] as { text: string }).text)).toEqual(mockResponse);
    expect(mockClient.post).toHaveBeenCalledWith('/api/field/42/rescan_values');
  });

  it('should handle async rescan response', async () => {
    const mockResponse = {
      status: 'pending',
      job_id: 'rescan-12345',
    };

    const mockClient = {
      post: vi.fn().mockResolvedValue(mockResponse),
    } as unknown as MetabaseClient;

    const result = await rescanFieldValuesDefinition.handler(mockClient, { id: 100 });

    expect(result.content[0].type).toBe('text');
    expect(JSON.parse((result.content[0] as { text: string }).text)).toEqual(mockResponse);
    expect(mockClient.post).toHaveBeenCalledWith('/api/field/100/rescan_values');
  });

  it('should propagate client errors', async () => {
    const mockClient = {
      post: vi.fn().mockRejectedValue(new Error('Field not found')),
    } as unknown as MetabaseClient;

    await expect(rescanFieldValuesDefinition.handler(mockClient, { id: 999 })).rejects.toThrow(
      'Field not found',
    );
    expect(mockClient.post).toHaveBeenCalledWith('/api/field/999/rescan_values');
  });

  it('should propagate API errors with status codes', async () => {
    const apiError = new Error('Forbidden');
    (apiError as Error & { status?: number }).status = 403;

    const mockClient = {
      post: vi.fn().mockRejectedValue(apiError),
    } as unknown as MetabaseClient;

    await expect(rescanFieldValuesDefinition.handler(mockClient, { id: 1 })).rejects.toThrow(
      'Forbidden',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(rescanFieldValuesDefinition.name).toBe('rescan_field_values');
    expect(rescanFieldValuesDefinition.description).toBe(
      'Trigger a rescan of the cached values for a field in Metabase',
    );
    expect(rescanFieldValuesDefinition.inputSchema).toEqual(RescanFieldValuesInputSchema);
  });
});
