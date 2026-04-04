import { GetFieldSummaryInputSchema } from '@src/schemas/field';
import { getFieldSummaryDefinition } from '@src/tools/field/get-field-summary';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('getFieldSummary tool', () => {
  it('should return formatted MCP response', async () => {
    const mockResponse = { count: 100, distinct_count: 50 };
    const mockClient = createMockClientWithResponse('get', mockResponse);
    const result = await getFieldSummaryDefinition.handler(mockClient, { id: 1 });
    expectMcpContent(result, mockResponse);
    expect(mockClient.get).toHaveBeenCalledWith('/api/field/1/summary');
    expect(mockClient.get).toHaveBeenCalledOnce();
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'Not found');
    await expect(getFieldSummaryDefinition.handler(mockClient, { id: 999 })).rejects.toThrow('Not found');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Unauthorized', 401));
    await expect(getFieldSummaryDefinition.handler(mockClient, { id: 1 })).rejects.toThrow('Unauthorized');
  });

  it('should have correct tool definition metadata', () => {
    expect(getFieldSummaryDefinition.name).toBe('get_field_summary');
    expect(getFieldSummaryDefinition.description).toBe('Get summary statistics for a field in Metabase');
    expect(getFieldSummaryDefinition.inputSchema).toEqual(GetFieldSummaryInputSchema);
  });
});
