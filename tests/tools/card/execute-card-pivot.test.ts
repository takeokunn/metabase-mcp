import { ExecuteCardPivotParamsSchema } from '@src/schemas/card';
import { executeCardPivotDefinition } from '@src/tools/card/execute-card-pivot';
import { describe, expect, it } from 'vitest';

import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('executeCardPivot tool', () => {
  it('should return formatted MCP response with pivot query results', async () => {
    const mockResult = {
      data: { rows: [[1, 'A', 100]], cols: [{ name: 'id' }, { name: 'cat' }, { name: 'val' }] },
      row_count: 1,
    };
    const mockClient = createMockClientWithResponse('post', mockResult);

    const result = await executeCardPivotDefinition.handler(mockClient, { id: 1 });

    expectMcpContent(result, mockResult);
    expect(mockClient.post).toHaveBeenCalledWith('/api/card/pivot/1/query', undefined);
    expect(mockClient.post).toHaveBeenCalledOnce();
  });

  it('should pass parameters when provided', async () => {
    const mockResult = { data: { rows: [], cols: [] }, row_count: 0 };
    const mockClient = createMockClientWithResponse('post', mockResult);
    const params = [{ id: 'p1', value: 'foo' }];

    await executeCardPivotDefinition.handler(mockClient, { id: 5, parameters: params });

    expect(mockClient.post).toHaveBeenCalledWith('/api/card/pivot/5/query', {
      parameters: params,
    });
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('post', 'Card not found');
    await expect(executeCardPivotDefinition.handler(mockClient, { id: 999 })).rejects.toThrow(
      'Card not found',
    );
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('post', createApiError('Forbidden', 403));
    await expect(executeCardPivotDefinition.handler(mockClient, { id: 1 })).rejects.toThrow(
      'Forbidden',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(executeCardPivotDefinition.name).toBe('execute_card_pivot');
    expect(executeCardPivotDefinition.inputSchema).toEqual(ExecuteCardPivotParamsSchema);
  });
});
