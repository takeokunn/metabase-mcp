import { GetPreviewEmbedCardParamValuesSchema } from '@src/schemas/preview-embed';
import { getPreviewEmbedCardParamValuesDefinition } from '@src/tools/preview-embed/get-preview-embed-card-param-values';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('getPreviewEmbedCardParamValues tool', () => {
  const input = { token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.preview', param_key: 'category' };

  it('should return formatted MCP response', async () => {
    const mockResult = { values: ['electronics', 'books'] };
    const mockClient = createMockClientWithResponse('get', mockResult);
    const result = await getPreviewEmbedCardParamValuesDefinition.handler(mockClient, input);
    expectMcpContent(result, mockResult);
    expect(mockClient.get).toHaveBeenCalledWith(
      `/api/preview_embed/card/${input.token}/params/${input.param_key}/values`,
    );
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'API error');
    await expect(
      getPreviewEmbedCardParamValuesDefinition.handler(mockClient, input),
    ).rejects.toThrow('API error');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Not Found', 404));
    await expect(
      getPreviewEmbedCardParamValuesDefinition.handler(mockClient, input),
    ).rejects.toThrow('Not Found');
  });

  it('should have correct tool definition metadata', () => {
    expect(getPreviewEmbedCardParamValuesDefinition.name).toBe(
      'get_preview_embed_card_param_values',
    );
    expect(getPreviewEmbedCardParamValuesDefinition.description).toBe(
      'Get values for a parameter of a preview embedded card in Metabase',
    );
    expect(getPreviewEmbedCardParamValuesDefinition.inputSchema).toEqual(
      GetPreviewEmbedCardParamValuesSchema,
    );
  });
});
