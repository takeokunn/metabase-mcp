import { GetPreviewEmbedDashboardParamRemappingSchema } from '@src/schemas/preview-embed';
import { getPreviewEmbedDashboardParamRemappingDefinition } from '@src/tools/preview-embed/get-preview-embed-dashboard-param-remapping';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('getPreviewEmbedDashboardParamRemapping tool', () => {
  const input = { token: 'test-preview-embed-token-abc123', param_key: 'category' };

  it('should return formatted MCP response', async () => {
    const mockResult = { values: [['1', 'One']] };
    const mockClient = createMockClientWithResponse('get', mockResult);
    const result = await getPreviewEmbedDashboardParamRemappingDefinition.handler(
      mockClient,
      input,
    );
    expectMcpContent(result, mockResult);
    expect(mockClient.get).toHaveBeenCalledWith(
      `/api/preview_embed/dashboard/${input.token}/params/${input.param_key}/remapping`,
    );
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'API error');
    await expect(
      getPreviewEmbedDashboardParamRemappingDefinition.handler(mockClient, input),
    ).rejects.toThrow('API error');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Not Found', 404));
    await expect(
      getPreviewEmbedDashboardParamRemappingDefinition.handler(mockClient, input),
    ).rejects.toThrow('Not Found');
  });

  it('should have correct tool definition metadata', () => {
    expect(getPreviewEmbedDashboardParamRemappingDefinition.name).toBe(
      'get_preview_embed_dashboard_param_remapping',
    );
    expect(getPreviewEmbedDashboardParamRemappingDefinition.description).toBe(
      'Get remapping for a parameter of a preview embedded dashboard in Metabase',
    );
    expect(getPreviewEmbedDashboardParamRemappingDefinition.inputSchema).toEqual(
      GetPreviewEmbedDashboardParamRemappingSchema,
    );
  });
});
