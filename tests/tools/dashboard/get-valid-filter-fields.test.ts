import { GetValidFilterFieldsInputSchema } from '@src/schemas/dashboard';
import { getValidFilterFieldsDefinition } from '@src/tools/dashboard/get-valid-filter-fields';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('getValidFilterFields tool', () => {
  it('should return formatted MCP response with valid filter fields', async () => {
    const mockClient = createMockClientWithResponse('get', { 1: [2, 3] });
    const result = await getValidFilterFieldsDefinition.handler(mockClient, { filtered: [1], filtering: [2, 3] });
    expectMcpContent(result, { 1: [2, 3] });
    expect(mockClient.get).toHaveBeenCalledWith('/api/dashboard/params/valid-filter-fields', { filtered: [1], filtering: [2, 3] });
    expect(mockClient.get).toHaveBeenCalledOnce();
  });
  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'Not found');
    await expect(getValidFilterFieldsDefinition.handler(mockClient, { filtered: [1], filtering: [2] })).rejects.toThrow('Not found');
  });
  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Unauthorized', 401));
    await expect(getValidFilterFieldsDefinition.handler(mockClient, { filtered: [1], filtering: [2] })).rejects.toThrow('Unauthorized');
  });
  it('should have correct tool definition metadata', () => {
    expect(getValidFilterFieldsDefinition.name).toBe('get_valid_filter_fields');
    expect(getValidFilterFieldsDefinition.description).toBe('Get valid filter fields for dashboard parameters in Metabase');
    expect(getValidFilterFieldsDefinition.inputSchema).toEqual(GetValidFilterFieldsInputSchema);
  });
});
