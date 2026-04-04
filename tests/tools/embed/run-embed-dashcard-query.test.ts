import { RunEmbedDashcardQuerySchema } from '@src/schemas/embed';
import { runEmbedDashcardQueryDefinition } from '@src/tools/embed/run-embed-dashcard-query';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('runEmbedDashcardQuery tool', () => {
  const input = { token: 'test-embed-token-abc123', dashcard_id: 42, card_id: 1 };

  it('should return formatted MCP response', async () => {
    const mockResult = { data: { rows: [] } };
    const mockClient = createMockClientWithResponse('get', mockResult);
    const result = await runEmbedDashcardQueryDefinition.handler(mockClient, input);
    expectMcpContent(result, mockResult);
    expect(mockClient.get).toHaveBeenCalledWith(
      `/api/embed/dashboard/${input.token}/dashcard/${input.dashcard_id}/card/${input.card_id}/query`,
    );
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'API error');
    await expect(runEmbedDashcardQueryDefinition.handler(mockClient, input)).rejects.toThrow(
      'API error',
    );
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Not Found', 404));
    await expect(runEmbedDashcardQueryDefinition.handler(mockClient, input)).rejects.toThrow(
      'Not Found',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(runEmbedDashcardQueryDefinition.name).toBe('run_embed_dashcard_query');
    expect(runEmbedDashcardQueryDefinition.description).toBe(
      'Run a query for an embedded dashcard in Metabase',
    );
    expect(runEmbedDashcardQueryDefinition.inputSchema).toEqual(RunEmbedDashcardQuerySchema);
  });
});
