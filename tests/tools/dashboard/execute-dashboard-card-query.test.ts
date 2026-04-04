import { ExecuteDashboardCardQueryInputSchema } from '@src/schemas/dashboard';
import { executeDashboardCardQueryDefinition } from '@src/tools/dashboard/execute-dashboard-card-query';
import { describe, expect, it } from 'vitest';

import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('executeDashboardCardQuery tool', () => {
  const baseInput = { id: 1, dashcard_id: 2, card_id: 3 };

  it('should return formatted MCP response with query results', async () => {
    const mockResult = {
      data: { rows: [[1, 'A']], cols: [{ name: 'id' }, { name: 'name' }] },
      row_count: 1,
    };

    const mockClient = createMockClientWithResponse('post', mockResult);
    const result = await executeDashboardCardQueryDefinition.handler(mockClient, baseInput);

    expectMcpContent(result, mockResult);
    expect(mockClient.post).toHaveBeenCalledWith('/api/dashboard/1/dashcard/2/card/3/query', {
      parameters: [],
    });
    expect(mockClient.post).toHaveBeenCalledOnce();
  });

  it('should pass provided parameters', async () => {
    const mockResult = { data: { rows: [], cols: [] }, row_count: 0 };
    const mockClient = createMockClientWithResponse('post', mockResult);
    const params = [{ id: 'param1', value: 'foo' }];

    const result = await executeDashboardCardQueryDefinition.handler(mockClient, {
      ...baseInput,
      parameters: params,
    });

    expectMcpContent(result, mockResult);
    expect(mockClient.post).toHaveBeenCalledWith('/api/dashboard/1/dashcard/2/card/3/query', {
      parameters: params,
    });
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('post', 'Dashboard not found');
    await expect(
      executeDashboardCardQueryDefinition.handler(mockClient, baseInput),
    ).rejects.toThrow('Dashboard not found');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('post', createApiError('Forbidden', 403));
    await expect(
      executeDashboardCardQueryDefinition.handler(mockClient, baseInput),
    ).rejects.toThrow('Forbidden');
  });

  it('should have correct tool definition metadata', () => {
    expect(executeDashboardCardQueryDefinition.name).toBe('execute_dashboard_card_query');
    expect(executeDashboardCardQueryDefinition.description).toBe(
      'Execute a dashcard query with dashboard filter parameters in Metabase',
    );
    expect(executeDashboardCardQueryDefinition.inputSchema).toEqual(
      ExecuteDashboardCardQueryInputSchema,
    );
  });
});
