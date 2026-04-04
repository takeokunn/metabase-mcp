import { GetPublicCardParamValuesSchema } from '@src/schemas/public';
import { getPublicCardParamValuesDefinition } from '@src/tools/public/get-public-card-param-values';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('getPublicCardParamValues tool', () => {
  const input = { uuid: '550e8400-e29b-41d4-a716-446655440000', param_key: 'category' };

  it('should return formatted MCP response', async () => {
    const mockResult = { values: ['electronics', 'books'] };
    const mockClient = createMockClientWithResponse('get', mockResult);
    const result = await getPublicCardParamValuesDefinition.handler(mockClient, input);
    expectMcpContent(result, mockResult);
    expect(mockClient.get).toHaveBeenCalledWith(
      `/api/public/card/${input.uuid}/params/${input.param_key}/values`,
    );
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'API error');
    await expect(getPublicCardParamValuesDefinition.handler(mockClient, input)).rejects.toThrow('API error');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Not Found', 404));
    await expect(getPublicCardParamValuesDefinition.handler(mockClient, input)).rejects.toThrow('Not Found');
  });

  it('should have correct tool definition metadata', () => {
    expect(getPublicCardParamValuesDefinition.name).toBe('get_public_card_param_values');
    expect(getPublicCardParamValuesDefinition.description).toBe('Get values for a parameter of a public card in Metabase');
    expect(getPublicCardParamValuesDefinition.inputSchema).toEqual(GetPublicCardParamValuesSchema);
  });
});
