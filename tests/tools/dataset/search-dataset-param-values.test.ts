import { SearchDatasetParamValuesInputSchema } from '@src/schemas/dataset';
import { searchDatasetParamValuesDefinition } from '@src/tools/dataset/search-dataset-param-values';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('searchDatasetParamValues tool', () => {
  it('should return formatted MCP response', async () => {
    const mockResponse = { values: ['result1', 'result2'] };
    const mockClient = createMockClientWithResponse('post', mockResponse);
    const input = { query: 'test', parameter: { type: 'category' } };
    const result = await searchDatasetParamValuesDefinition.handler(mockClient, input);
    expectMcpContent(result, mockResponse);
    expect(mockClient.post).toHaveBeenCalledWith('/api/dataset/parameter/search/test', {
      parameter: { type: 'category' },
      field_ids: undefined,
    });
    expect(mockClient.post).toHaveBeenCalledOnce();
  });

  it('should pass field_ids when provided', async () => {
    const mockResponse = { values: [] };
    const mockClient = createMockClientWithResponse('post', mockResponse);
    const input = { query: 'foo', parameter: { type: 'category' }, field_ids: [10, 20] };
    await searchDatasetParamValuesDefinition.handler(mockClient, input);
    expect(mockClient.post).toHaveBeenCalledWith('/api/dataset/parameter/search/foo', {
      parameter: { type: 'category' },
      field_ids: [10, 20],
    });
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('post', 'Not found');
    await expect(
      searchDatasetParamValuesDefinition.handler(mockClient, { query: 'x', parameter: {} }),
    ).rejects.toThrow('Not found');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('post', createApiError('Unauthorized', 401));
    await expect(
      searchDatasetParamValuesDefinition.handler(mockClient, { query: 'x', parameter: {} }),
    ).rejects.toThrow('Unauthorized');
  });

  it('should have correct tool definition metadata', () => {
    expect(searchDatasetParamValuesDefinition.name).toBe('search_dataset_param_values');
    expect(searchDatasetParamValuesDefinition.description).toBe(
      'Search values for a dataset parameter in Metabase',
    );
    expect(searchDatasetParamValuesDefinition.inputSchema).toEqual(
      SearchDatasetParamValuesInputSchema,
    );
  });
});
