import { GetXrayModelIndexInputSchema } from '@src/schemas/automagic-dashboard';
import { getXrayModelIndexDefinition } from '@src/tools/automagic-dashboard/get-xray-model-index';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('getXrayModelIndex tool', () => {
  const input = { model_index_id: 1, pk_id: 42 };

  it('should return formatted MCP response', async () => {
    const mockResult = { id: 'model-index', name: 'Model Index X-ray' };
    const mockClient = createMockClientWithResponse('get', mockResult);
    const result = await getXrayModelIndexDefinition.handler(mockClient, input);
    expectMcpContent(result, mockResult);
    expect(mockClient.get).toHaveBeenCalledWith(
      '/api/automagic-dashboards/model_index/1/primary_key/42',
    );
    expect(mockClient.get).toHaveBeenCalledOnce();
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'API error');
    await expect(getXrayModelIndexDefinition.handler(mockClient, input)).rejects.toThrow(
      'API error',
    );
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Not Found', 404));
    await expect(getXrayModelIndexDefinition.handler(mockClient, input)).rejects.toThrow(
      'Not Found',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(getXrayModelIndexDefinition.name).toBe('get_xray_model_index');
    expect(getXrayModelIndexDefinition.description).toBe(
      'Get an x-ray automagic dashboard for a model index by primary key in Metabase',
    );
    expect(getXrayModelIndexDefinition.inputSchema).toEqual(GetXrayModelIndexInputSchema);
  });
});
