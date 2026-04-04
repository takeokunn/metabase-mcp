import { GetDatasetQueryMetadataInputSchema } from '@src/schemas/dataset';
import { getDatasetQueryMetadataDefinition } from '@src/tools/dataset/get-dataset-query-metadata';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('getDatasetQueryMetadata tool', () => {
  it('should return formatted MCP response', async () => {
    const mockResponse = { tables: [{ id: 1, name: 'orders' }] };
    const mockClient = createMockClientWithResponse('post', mockResponse);
    const input = { query: { 'source-table': 1 } };
    const result = await getDatasetQueryMetadataDefinition.handler(mockClient, input);
    expectMcpContent(result, mockResponse);
    expect(mockClient.post).toHaveBeenCalledWith('/api/dataset/query_metadata', {
      'source-table': 1,
    });
    expect(mockClient.post).toHaveBeenCalledOnce();
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('post', 'Not found');
    await expect(
      getDatasetQueryMetadataDefinition.handler(mockClient, { query: {} }),
    ).rejects.toThrow('Not found');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('post', createApiError('Unauthorized', 401));
    await expect(
      getDatasetQueryMetadataDefinition.handler(mockClient, { query: {} }),
    ).rejects.toThrow('Unauthorized');
  });

  it('should have correct tool definition metadata', () => {
    expect(getDatasetQueryMetadataDefinition.name).toBe('get_dataset_query_metadata');
    expect(getDatasetQueryMetadataDefinition.description).toBe(
      'Get metadata for a dataset query in Metabase',
    );
    expect(getDatasetQueryMetadataDefinition.inputSchema).toEqual(
      GetDatasetQueryMetadataInputSchema,
    );
  });
});
