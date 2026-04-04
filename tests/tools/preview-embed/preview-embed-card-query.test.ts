import { PreviewEmbedCardQueryParamsSchema } from '@src/schemas/preview-embed';
import { previewEmbedCardQueryDefinition } from '@src/tools/preview-embed/preview-embed-card-query';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('previewEmbedCardQuery tool', () => {
  const input = { token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.preview' };

  it('should return formatted MCP response', async () => {
    const mockResult = { data: { rows: [[1, 'Alice']], cols: [{ name: 'id' }, { name: 'name' }] } };
    const mockClient = createMockClientWithResponse('get', mockResult);
    const result = await previewEmbedCardQueryDefinition.handler(mockClient, input);
    expectMcpContent(result, mockResult);
    expect(mockClient.get).toHaveBeenCalledWith(`/api/preview_embed/card/${input.token}/query`);
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'API error');
    await expect(previewEmbedCardQueryDefinition.handler(mockClient, input)).rejects.toThrow(
      'API error',
    );
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Unauthorized', 401));
    await expect(previewEmbedCardQueryDefinition.handler(mockClient, input)).rejects.toThrow(
      'Unauthorized',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(previewEmbedCardQueryDefinition.name).toBe('preview_embed_card_query');
    expect(previewEmbedCardQueryDefinition.inputSchema).toEqual(PreviewEmbedCardQueryParamsSchema);
  });
});
