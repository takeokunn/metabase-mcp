import { GetPublicCardParamRemappingSchema } from '@src/schemas/public';
import { getPublicCardParamRemappingDefinition } from '@src/tools/public/get-public-card-param-remapping';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('getPublicCardParamRemapping tool', () => {
  const input = { uuid: '550e8400-e29b-41d4-a716-446655440000', param_key: 'category' };

  it('should return formatted MCP response', async () => {
    const mockResult = { remapping: {} };
    const mockClient = createMockClientWithResponse('get', mockResult);
    const result = await getPublicCardParamRemappingDefinition.handler(mockClient, input);
    expectMcpContent(result, mockResult);
    expect(mockClient.get).toHaveBeenCalledWith(
      `/api/public/card/${input.uuid}/params/${input.param_key}/remapping`,
    );
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'API error');
    await expect(getPublicCardParamRemappingDefinition.handler(mockClient, input)).rejects.toThrow('API error');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Not Found', 404));
    await expect(getPublicCardParamRemappingDefinition.handler(mockClient, input)).rejects.toThrow('Not Found');
  });

  it('should have correct tool definition metadata', () => {
    expect(getPublicCardParamRemappingDefinition.name).toBe('get_public_card_param_remapping');
    expect(getPublicCardParamRemappingDefinition.description).toBe('Get remapping for a parameter of a public card in Metabase');
    expect(getPublicCardParamRemappingDefinition.inputSchema).toEqual(GetPublicCardParamRemappingSchema);
  });
});
