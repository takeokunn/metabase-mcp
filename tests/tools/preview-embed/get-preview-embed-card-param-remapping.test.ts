import { GetPreviewEmbedCardParamRemappingSchema } from '@src/schemas/preview-embed';
import { getPreviewEmbedCardParamRemappingDefinition } from '@src/tools/preview-embed/get-preview-embed-card-param-remapping';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('getPreviewEmbedCardParamRemapping tool', () => {
  const input = { token: 'test-preview-embed-token-abc123', param_key: 'category' };

  it('should return formatted MCP response', async () => {
    const mockResult = { values: [['1', 'One']] };
    const mockClient = createMockClientWithResponse('get', mockResult);
    const result = await getPreviewEmbedCardParamRemappingDefinition.handler(mockClient, input);
    expectMcpContent(result, mockResult);
    expect(mockClient.get).toHaveBeenCalledWith(
      `/api/preview_embed/card/${input.token}/params/${input.param_key}/remapping`,
    );
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'API error');
    await expect(
      getPreviewEmbedCardParamRemappingDefinition.handler(mockClient, input),
    ).rejects.toThrow('API error');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Not Found', 404));
    await expect(
      getPreviewEmbedCardParamRemappingDefinition.handler(mockClient, input),
    ).rejects.toThrow('Not Found');
  });

  it('should have correct tool definition metadata', () => {
    expect(getPreviewEmbedCardParamRemappingDefinition.name).toBe(
      'get_preview_embed_card_param_remapping',
    );
    expect(getPreviewEmbedCardParamRemappingDefinition.description).toBe(
      'Get remapping for a parameter of a preview embedded card in Metabase',
    );
    expect(getPreviewEmbedCardParamRemappingDefinition.inputSchema).toEqual(
      GetPreviewEmbedCardParamRemappingSchema,
    );
  });
});
