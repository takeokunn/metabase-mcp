import { PivotDashcardQueryInputSchema } from '@src/schemas/dashboard';
import { pivotDashcardQueryDefinition } from '@src/tools/dashboard/pivot-dashcard-query';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('pivotDashcardQuery tool', () => {
  it('should return formatted MCP response with pivot query results', async () => {
    const mockClient = createMockClientWithResponse('post', { data: { rows: [] } });
    const result = await pivotDashcardQueryDefinition.handler(mockClient, {
      dashboard_id: 1,
      dashcard_id: 2,
      card_id: 3,
    });
    expectMcpContent(result, { data: { rows: [] } });
    expect(mockClient.post).toHaveBeenCalledWith('/api/dashboard/pivot/1/dashcard/2/card/3/query', {
      parameters: [],
    });
    expect(mockClient.post).toHaveBeenCalledOnce();
  });
  it('should pass parameters when provided', async () => {
    const mockClient = createMockClientWithResponse('post', { data: { rows: [] } });
    await pivotDashcardQueryDefinition.handler(mockClient, {
      dashboard_id: 1,
      dashcard_id: 2,
      card_id: 3,
      parameters: [{ type: 'category', value: 'foo' }],
    });
    expect(mockClient.post).toHaveBeenCalledWith('/api/dashboard/pivot/1/dashcard/2/card/3/query', {
      parameters: [{ type: 'category', value: 'foo' }],
    });
  });
  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('post', 'Not found');
    await expect(
      pivotDashcardQueryDefinition.handler(mockClient, {
        dashboard_id: 999,
        dashcard_id: 1,
        card_id: 1,
      }),
    ).rejects.toThrow('Not found');
  });
  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('post', createApiError('Unauthorized', 401));
    await expect(
      pivotDashcardQueryDefinition.handler(mockClient, {
        dashboard_id: 1,
        dashcard_id: 1,
        card_id: 1,
      }),
    ).rejects.toThrow('Unauthorized');
  });
  it('should have correct tool definition metadata', () => {
    expect(pivotDashcardQueryDefinition.name).toBe('pivot_dashcard_query');
    expect(pivotDashcardQueryDefinition.description).toBe(
      'Run a pivot query for a specific dashcard in Metabase',
    );
    expect(pivotDashcardQueryDefinition.inputSchema).toEqual(PivotDashcardQueryInputSchema);
  });
});
