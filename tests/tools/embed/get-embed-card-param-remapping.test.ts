import { GetEmbedCardParamRemappingSchema } from '@src/schemas/embed';
import { getEmbedCardParamRemappingDefinition } from '@src/tools/embed/get-embed-card-param-remapping';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('getEmbedCardParamRemapping tool', () => {
  const input = { token: 'test-embed-token-abc123', param_key: 'category' };

  it('should return formatted MCP response', async () => {
    const mockResult = { values: [['1', 'One']] };
    const mockClient = createMockClientWithResponse('get', mockResult);
    const result = await getEmbedCardParamRemappingDefinition.handler(mockClient, input);
    expectMcpContent(result, mockResult);
    expect(mockClient.get).toHaveBeenCalledWith(
      `/api/embed/card/${input.token}/params/${input.param_key}/remapping`,
    );
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'API error');
    await expect(getEmbedCardParamRemappingDefinition.handler(mockClient, input)).rejects.toThrow(
      'API error',
    );
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Not Found', 404));
    await expect(getEmbedCardParamRemappingDefinition.handler(mockClient, input)).rejects.toThrow(
      'Not Found',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(getEmbedCardParamRemappingDefinition.name).toBe('get_embed_card_param_remapping');
    expect(getEmbedCardParamRemappingDefinition.description).toBe(
      'Get remapping for a parameter of an embedded card in Metabase',
    );
    expect(getEmbedCardParamRemappingDefinition.inputSchema).toEqual(
      GetEmbedCardParamRemappingSchema,
    );
  });
});
