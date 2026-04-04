import { GetPreviewEmbedDashboardParamValuesSchema } from '@src/schemas/preview-embed';
import { getPreviewEmbedDashboardParamValuesDefinition } from '@src/tools/preview-embed/get-preview-embed-dashboard-param-values';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('getPreviewEmbedDashboardParamValues tool', () => {
  const input = { token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.preview', param_key: 'date_filter' };

  it('should return formatted MCP response', async () => {
    const mockResult = { values: ['2024-01-01', '2024-02-01'] };
    const mockClient = createMockClientWithResponse('get', mockResult);
    const result = await getPreviewEmbedDashboardParamValuesDefinition.handler(mockClient, input);
    expectMcpContent(result, mockResult);
    expect(mockClient.get).toHaveBeenCalledWith(
      `/api/preview_embed/dashboard/${input.token}/params/${input.param_key}/values`,
    );
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'API error');
    await expect(getPreviewEmbedDashboardParamValuesDefinition.handler(mockClient, input)).rejects.toThrow('API error');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Not Found', 404));
    await expect(getPreviewEmbedDashboardParamValuesDefinition.handler(mockClient, input)).rejects.toThrow('Not Found');
  });

  it('should have correct tool definition metadata', () => {
    expect(getPreviewEmbedDashboardParamValuesDefinition.name).toBe('get_preview_embed_dashboard_param_values');
    expect(getPreviewEmbedDashboardParamValuesDefinition.description).toBe('Get values for a parameter of a preview embedded dashboard in Metabase');
    expect(getPreviewEmbedDashboardParamValuesDefinition.inputSchema).toEqual(GetPreviewEmbedDashboardParamValuesSchema);
  });
});
