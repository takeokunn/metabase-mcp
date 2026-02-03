import { DiscardFieldValuesInputSchema } from '@src/schemas/field';
import { discardFieldValuesDefinition } from '@src/tools/field/discard-field-values';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('discardFieldValues tool', () => {
  it('should return formatted MCP response after discarding field values', async () => {
    const mockResponse = {
      success: true,
    };

    const mockClient = createMockClientWithResponse('post', mockResponse);

    const result = await discardFieldValuesDefinition.handler(mockClient, { id: 1 });

    expectMcpContent(result, mockResponse);
    expect(mockClient.post).toHaveBeenCalledWith('/api/field/1/discard_values');
    expect(mockClient.post).toHaveBeenCalledOnce();
  });

  it('should handle discard for different field IDs', async () => {
    const mockResponse = {
      success: true,
      message: 'Field values discarded',
    };

    const mockClient = createMockClientWithResponse('post', mockResponse);

    const result = await discardFieldValuesDefinition.handler(mockClient, { id: 42 });

    expectMcpContent(result, mockResponse);
    expect(mockClient.post).toHaveBeenCalledWith('/api/field/42/discard_values');
  });

  it('should handle empty response', async () => {
    const mockResponse = {};

    const mockClient = createMockClientWithResponse('post', mockResponse);

    const result = await discardFieldValuesDefinition.handler(mockClient, { id: 100 });

    expectMcpContent(result, mockResponse);
    expect(mockClient.post).toHaveBeenCalledWith('/api/field/100/discard_values');
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('post', 'Field not found');

    await expect(discardFieldValuesDefinition.handler(mockClient, { id: 999 })).rejects.toThrow(
      'Field not found',
    );
    expect(mockClient.post).toHaveBeenCalledWith('/api/field/999/discard_values');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('post', createApiError('Forbidden', 403));

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
