import { RunEmbedCardPivotQuerySchema } from '@src/schemas/embed';
import { runEmbedCardPivotQueryDefinition } from '@src/tools/embed/run-embed-card-pivot-query';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('runEmbedCardPivotQuery tool', () => {
  const input = { token: 'test-embed-token-abc123' };

  it('should return formatted MCP response', async () => {
    const mockResult = { data: { rows: [] } };
    const mockClient = createMockClientWithResponse('get', mockResult);
    const result = await runEmbedCardPivotQueryDefinition.handler(mockClient, input);
    expectMcpContent(result, mockResult);
    expect(mockClient.get).toHaveBeenCalledWith(
      `/api/embed/pivot/card/${input.token}/query`,
      {},
    );
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'API error');
    await expect(runEmbedCardPivotQueryDefinition.handler(mockClient, input)).rejects.toThrow('API error');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Not Found', 404));
    await expect(runEmbedCardPivotQueryDefinition.handler(mockClient, input)).rejects.toThrow('Not Found');
  });

  it('should have correct tool definition metadata', () => {
    expect(runEmbedCardPivotQueryDefinition.name).toBe('run_embed_card_pivot_query');
    expect(runEmbedCardPivotQueryDefinition.description).toBe('Run a pivot query for an embedded card in Metabase');
    expect(runEmbedCardPivotQueryDefinition.inputSchema).toEqual(RunEmbedCardPivotQuerySchema);
  });
});
