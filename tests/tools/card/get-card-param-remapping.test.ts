import { GetCardParamRemappingInputSchema } from '@src/schemas/card';
import { getCardParamRemappingDefinition } from '@src/tools/card/get-card-param-remapping';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('getCardParamRemapping tool', () => {
  it('should return formatted MCP response with remapping data', async () => {
    const mockClient = createMockClientWithResponse('get', { remapping: {} });
    const result = await getCardParamRemappingDefinition.handler(mockClient, { card_id: 1, param_key: 'category' });
    expectMcpContent(result, { remapping: {} });
    expect(mockClient.get).toHaveBeenCalledWith('/api/card/1/params/category/remapping');
    expect(mockClient.get).toHaveBeenCalledOnce();
  });
  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'Not found');
    await expect(getCardParamRemappingDefinition.handler(mockClient, { card_id: 999, param_key: 'key' })).rejects.toThrow('Not found');
  });
  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Unauthorized', 401));
    await expect(getCardParamRemappingDefinition.handler(mockClient, { card_id: 1, param_key: 'key' })).rejects.toThrow('Unauthorized');
  });
  it('should have correct tool definition metadata', () => {
    expect(getCardParamRemappingDefinition.name).toBe('get_card_param_remapping');
    expect(getCardParamRemappingDefinition.description).toBe('Get remapping for a parameter of a card in Metabase');
    expect(getCardParamRemappingDefinition.inputSchema).toEqual(GetCardParamRemappingInputSchema);
  });
});
