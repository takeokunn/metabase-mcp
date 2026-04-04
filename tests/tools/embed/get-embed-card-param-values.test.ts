import { GetEmbedCardParamValuesSchema } from '@src/schemas/embed';
import { getEmbedCardParamValuesDefinition } from '@src/tools/embed/get-embed-card-param-values';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('getEmbedCardParamValues tool', () => {
  const input = { token: 'test-embed-token-abc123', param_key: 'category' };

  it('should return formatted MCP response', async () => {
    const mockResult = { values: ['electronics', 'books'] };
    const mockClient = createMockClientWithResponse('get', mockResult);
    const result = await getEmbedCardParamValuesDefinition.handler(mockClient, input);
    expectMcpContent(result, mockResult);
    expect(mockClient.get).toHaveBeenCalledWith(
      `/api/embed/card/${input.token}/params/${input.param_key}/values`,
    );
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'API error');
    await expect(getEmbedCardParamValuesDefinition.handler(mockClient, input)).rejects.toThrow('API error');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Not Found', 404));
    await expect(getEmbedCardParamValuesDefinition.handler(mockClient, input)).rejects.toThrow('Not Found');
  });

  it('should have correct tool definition metadata', () => {
    expect(getEmbedCardParamValuesDefinition.name).toBe('get_embed_card_param_values');
    expect(getEmbedCardParamValuesDefinition.description).toBe('Get values for a parameter of an embedded card in Metabase');
    expect(getEmbedCardParamValuesDefinition.inputSchema).toEqual(GetEmbedCardParamValuesSchema);
  });
});
