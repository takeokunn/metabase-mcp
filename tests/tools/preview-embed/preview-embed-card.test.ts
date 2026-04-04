import { PreviewEmbedCardParamsSchema } from '@src/schemas/preview-embed';
import { previewEmbedCardDefinition } from '@src/tools/preview-embed/preview-embed-card';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('previewEmbedCard tool', () => {
  const input = { token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.preview' };

  it('should return formatted MCP response', async () => {
    const mockResult = { id: 1, name: 'Sales Chart' };
    const mockClient = createMockClientWithResponse('get', mockResult);
    const result = await previewEmbedCardDefinition.handler(mockClient, input);
    expectMcpContent(result, mockResult);
    expect(mockClient.get).toHaveBeenCalledWith(`/api/preview_embed/card/${input.token}`);
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'API error');
    await expect(previewEmbedCardDefinition.handler(mockClient, input)).rejects.toThrow('API error');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Forbidden', 403));
    await expect(previewEmbedCardDefinition.handler(mockClient, input)).rejects.toThrow('Forbidden');
  });

  it('should have correct tool definition metadata', () => {
    expect(previewEmbedCardDefinition.name).toBe('preview_embed_card');
    expect(previewEmbedCardDefinition.inputSchema).toEqual(PreviewEmbedCardParamsSchema);
  });
});
