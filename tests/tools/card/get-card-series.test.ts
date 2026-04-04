import { GetCardSeriesParamsSchema } from '@src/schemas/card';
import { getCardSeriesDefinition } from '@src/tools/card/get-card-series';
import { describe, expect, it } from 'vitest';

import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('getCardSeries tool', () => {
  it('should return formatted MCP response with series data', async () => {
    const mockResult = [
      { id: 2, name: 'Revenue Series' },
      { id: 3, name: 'Cost Series' },
    ];
    const mockClient = createMockClientWithResponse('get', mockResult);

    const result = await getCardSeriesDefinition.handler(mockClient, { id: 1 });

    expectMcpContent(result, mockResult);
    expect(mockClient.get).toHaveBeenCalledWith('/api/card/1/series');
    expect(mockClient.get).toHaveBeenCalledOnce();
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'Card not found');
    await expect(getCardSeriesDefinition.handler(mockClient, { id: 999 })).rejects.toThrow(
      'Card not found',
    );
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Forbidden', 403));
    await expect(getCardSeriesDefinition.handler(mockClient, { id: 1 })).rejects.toThrow(
      'Forbidden',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(getCardSeriesDefinition.name).toBe('get_card_series');
    expect(getCardSeriesDefinition.inputSchema).toEqual(GetCardSeriesParamsSchema);
  });
});
