import { RescanFieldValuesInputSchema } from '@src/schemas/field';
import { rescanFieldValuesDefinition } from '@src/tools/field/rescan-field-values';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('rescanFieldValues tool', () => {
  it('should return formatted MCP response after triggering rescan', async () => {
    const mockResponse = {
      success: true,
    };

    const mockClient = createMockClientWithResponse('post', mockResponse);

    const result = await rescanFieldValuesDefinition.handler(mockClient, { id: 1 });

    expectMcpContent(result, mockResponse);
    expect(mockClient.post).toHaveBeenCalledWith('/api/field/1/rescan_values');
    expect(mockClient.post).toHaveBeenCalledOnce();
  });

  it('should handle rescan for different field IDs', async () => {
    const mockResponse = {
      success: true,
      message: 'Rescan scheduled',
    };

    const mockClient = createMockClientWithResponse('post', mockResponse);

    const result = await rescanFieldValuesDefinition.handler(mockClient, { id: 42 });

    expectMcpContent(result, mockResponse);
    expect(mockClient.post).toHaveBeenCalledWith('/api/field/42/rescan_values');
  });

  it('should handle async rescan response', async () => {
    const mockResponse = {
      status: 'pending',
      job_id: 'rescan-12345',
    };

    const mockClient = createMockClientWithResponse('post', mockResponse);

    const result = await rescanFieldValuesDefinition.handler(mockClient, { id: 100 });

    expectMcpContent(result, mockResponse);
    expect(mockClient.post).toHaveBeenCalledWith('/api/field/100/rescan_values');
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('post', 'Field not found');

    await expect(rescanFieldValuesDefinition.handler(mockClient, { id: 999 })).rejects.toThrow(
      'Field not found',
    );
    expect(mockClient.post).toHaveBeenCalledWith('/api/field/999/rescan_values');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('post', createApiError('Forbidden', 403));

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
