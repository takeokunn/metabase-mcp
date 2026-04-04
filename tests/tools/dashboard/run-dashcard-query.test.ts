import { RunDashcardQueryInputSchema } from '@src/schemas/dashboard';
import { runDashcardQueryDefinition } from '@src/tools/dashboard/run-dashcard-query';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('runDashcardQuery tool', () => {
  it('should return formatted MCP response with query results', async () => {
    const mockClient = createMockClientWithResponse('post', { data: { rows: [] } });
    const result = await runDashcardQueryDefinition.handler(mockClient, { dashboard_id: 1, dashcard_id: 2, card_id: 3 });
    expectMcpContent(result, { data: { rows: [] } });
    expect(mockClient.post).toHaveBeenCalledWith('/api/dashboard/1/dashcard/2/card/3/query', { parameters: [] });
    expect(mockClient.post).toHaveBeenCalledOnce();
  });
  it('should pass parameters when provided', async () => {
    const mockClient = createMockClientWithResponse('post', { data: { rows: [] } });
    await runDashcardQueryDefinition.handler(mockClient, { dashboard_id: 1, dashcard_id: 2, card_id: 3, parameters: [{ type: 'category', value: 'foo' }] });
    expect(mockClient.post).toHaveBeenCalledWith('/api/dashboard/1/dashcard/2/card/3/query', { parameters: [{ type: 'category', value: 'foo' }] });
  });
  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('post', 'Not found');
    await expect(runDashcardQueryDefinition.handler(mockClient, { dashboard_id: 999, dashcard_id: 1, card_id: 1 })).rejects.toThrow('Not found');
  });
  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('post', createApiError('Unauthorized', 401));
    await expect(runDashcardQueryDefinition.handler(mockClient, { dashboard_id: 1, dashcard_id: 1, card_id: 1 })).rejects.toThrow('Unauthorized');
  });
  it('should have correct tool definition metadata', () => {
    expect(runDashcardQueryDefinition.name).toBe('run_dashcard_query');
    expect(runDashcardQueryDefinition.description).toBe('Run the query for a specific card on a dashboard in Metabase');
    expect(runDashcardQueryDefinition.inputSchema).toEqual(RunDashcardQueryInputSchema);
  });
});
