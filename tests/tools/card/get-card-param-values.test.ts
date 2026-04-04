import { GetCardParamValuesParamsSchema } from '@src/schemas/card';
import { getCardParamValuesDefinition } from '@src/tools/card/get-card-param-values';
import { describe, expect, it } from 'vitest';

import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('getCardParamValues tool', () => {
  const baseInput = { id: 1, param_key: 'category' };

  it('should return formatted MCP response with parameter values', async () => {
    const mockResult = { values: ['Electronics', 'Clothing'] };
    const mockClient = createMockClientWithResponse('get', mockResult);

    const result = await getCardParamValuesDefinition.handler(mockClient, baseInput);

    expectMcpContent(result, mockResult);
    expect(mockClient.get).toHaveBeenCalledWith('/api/card/1/params/category/values');
    expect(mockClient.get).toHaveBeenCalledOnce();
  });

  it('should encode param_key in the URL', async () => {
    const mockClient = createMockClientWithResponse('get', { values: [] });

    await getCardParamValuesDefinition.handler(mockClient, { id: 2, param_key: 'my key' });

    expect(mockClient.get).toHaveBeenCalledWith('/api/card/2/params/my%20key/values');
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'Card not found');
    await expect(getCardParamValuesDefinition.handler(mockClient, baseInput)).rejects.toThrow(
      'Card not found',
    );
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Forbidden', 403));
    await expect(getCardParamValuesDefinition.handler(mockClient, baseInput)).rejects.toThrow(
      'Forbidden',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(getCardParamValuesDefinition.name).toBe('get_card_param_values');
    expect(getCardParamValuesDefinition.inputSchema).toEqual(GetCardParamValuesParamsSchema);
  });
});
