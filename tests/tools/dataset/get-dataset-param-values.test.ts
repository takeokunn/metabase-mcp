import { GetDatasetParamValuesInputSchema } from '@src/schemas/dataset';
import { getDatasetParamValuesDefinition } from '@src/tools/dataset/get-dataset-param-values';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('getDatasetParamValues tool', () => {
  it('should return formatted MCP response', async () => {
    const mockResponse = { values: ['value1', 'value2'] };
    const mockClient = createMockClientWithResponse('post', mockResponse);
    const input = { parameter: { type: 'category', slug: 'param' } };
    const result = await getDatasetParamValuesDefinition.handler(mockClient, input);
    expectMcpContent(result, mockResponse);
    expect(mockClient.post).toHaveBeenCalledWith('/api/dataset/parameter/values', {
      parameter: { type: 'category', slug: 'param' },
      field_ids: undefined,
    });
    expect(mockClient.post).toHaveBeenCalledOnce();
  });

  it('should pass field_ids when provided', async () => {
    const mockResponse = { values: ['value1'] };
    const mockClient = createMockClientWithResponse('post', mockResponse);
    const input = { parameter: { type: 'category' }, field_ids: [1, 2, 3] };
    await getDatasetParamValuesDefinition.handler(mockClient, input);
    expect(mockClient.post).toHaveBeenCalledWith('/api/dataset/parameter/values', {
      parameter: { type: 'category' },
      field_ids: [1, 2, 3],
    });
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('post', 'Not found');
    await expect(
      getDatasetParamValuesDefinition.handler(mockClient, { parameter: {} }),
    ).rejects.toThrow('Not found');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('post', createApiError('Unauthorized', 401));
    await expect(
      getDatasetParamValuesDefinition.handler(mockClient, { parameter: {} }),
    ).rejects.toThrow('Unauthorized');
  });

  it('should have correct tool definition metadata', () => {
    expect(getDatasetParamValuesDefinition.name).toBe('get_dataset_param_values');
    expect(getDatasetParamValuesDefinition.description).toBe(
      'Get values for a dataset parameter in Metabase',
    );
    expect(getDatasetParamValuesDefinition.inputSchema).toEqual(GetDatasetParamValuesInputSchema);
  });
});
