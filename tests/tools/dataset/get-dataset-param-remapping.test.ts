import { GetDatasetParamRemappingInputSchema } from '@src/schemas/dataset';
import { getDatasetParamRemappingDefinition } from '@src/tools/dataset/get-dataset-param-remapping';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('getDatasetParamRemapping tool', () => {
  it('should return formatted MCP response', async () => {
    const mockResponse = { remapping: { 1: 'One', 2: 'Two' } };
    const mockClient = createMockClientWithResponse('post', mockResponse);
    const input = { parameter: { type: 'category' } };
    const result = await getDatasetParamRemappingDefinition.handler(mockClient, input);
    expectMcpContent(result, mockResponse);
    expect(mockClient.post).toHaveBeenCalledWith('/api/dataset/parameter/remapping', {
      parameter: { type: 'category' },
      field_ids: undefined,
    });
    expect(mockClient.post).toHaveBeenCalledOnce();
  });

  it('should pass field_ids when provided', async () => {
    const mockResponse = { remapping: {} };
    const mockClient = createMockClientWithResponse('post', mockResponse);
    const input = { parameter: { type: 'category' }, field_ids: [5] };
    await getDatasetParamRemappingDefinition.handler(mockClient, input);
    expect(mockClient.post).toHaveBeenCalledWith('/api/dataset/parameter/remapping', {
      parameter: { type: 'category' },
      field_ids: [5],
    });
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('post', 'Not found');
    await expect(
      getDatasetParamRemappingDefinition.handler(mockClient, { parameter: {} }),
    ).rejects.toThrow('Not found');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('post', createApiError('Unauthorized', 401));
    await expect(
      getDatasetParamRemappingDefinition.handler(mockClient, { parameter: {} }),
    ).rejects.toThrow('Unauthorized');
  });

  it('should have correct tool definition metadata', () => {
    expect(getDatasetParamRemappingDefinition.name).toBe('get_dataset_param_remapping');
    expect(getDatasetParamRemappingDefinition.description).toBe(
      'Get remapping for a dataset parameter in Metabase',
    );
    expect(getDatasetParamRemappingDefinition.inputSchema).toEqual(
      GetDatasetParamRemappingInputSchema,
    );
  });
});
