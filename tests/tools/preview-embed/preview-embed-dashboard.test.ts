import { PreviewEmbedDashboardParamsSchema } from '@src/schemas/preview-embed';
import { previewEmbedDashboardDefinition } from '@src/tools/preview-embed/preview-embed-dashboard';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('previewEmbedDashboard tool', () => {
  const input = { token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.preview' };

  it('should return formatted MCP response', async () => {
    const mockResult = { id: 1, name: 'Executive Dashboard', dashcards: [] };
    const mockClient = createMockClientWithResponse('get', mockResult);
    const result = await previewEmbedDashboardDefinition.handler(mockClient, input);
    expectMcpContent(result, mockResult);
    expect(mockClient.get).toHaveBeenCalledWith(`/api/preview_embed/dashboard/${input.token}`);
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'API error');
    await expect(previewEmbedDashboardDefinition.handler(mockClient, input)).rejects.toThrow(
      'API error',
    );
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Not Found', 404));
    await expect(previewEmbedDashboardDefinition.handler(mockClient, input)).rejects.toThrow(
      'Not Found',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(previewEmbedDashboardDefinition.name).toBe('preview_embed_dashboard');
    expect(previewEmbedDashboardDefinition.inputSchema).toEqual(PreviewEmbedDashboardParamsSchema);
  });
});
