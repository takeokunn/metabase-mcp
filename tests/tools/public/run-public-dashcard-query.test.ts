import { RunPublicDashcardQuerySchema } from '@src/schemas/public';
import { runPublicDashcardQueryDefinition } from '@src/tools/public/run-public-dashcard-query';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('runPublicDashcardQuery tool', () => {
  const input = { uuid: '550e8400-e29b-41d4-a716-446655440000', dashcard_id: 42, card_id: 1 };

  it('should return formatted MCP response', async () => {
    const mockResult = { data: { rows: [] } };
    const mockClient = createMockClientWithResponse('post', mockResult);
    const result = await runPublicDashcardQueryDefinition.handler(mockClient, input);
    expectMcpContent(result, mockResult);
    expect(mockClient.post).toHaveBeenCalledWith(
      `/api/public/dashboard/${input.uuid}/dashcard/${input.dashcard_id}/card/${input.card_id}/query`,
      { parameters: [] },
    );
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('post', 'API error');
    await expect(runPublicDashcardQueryDefinition.handler(mockClient, input)).rejects.toThrow('API error');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('post', createApiError('Not Found', 404));
    await expect(runPublicDashcardQueryDefinition.handler(mockClient, input)).rejects.toThrow('Not Found');
  });

  it('should have correct tool definition metadata', () => {
    expect(runPublicDashcardQueryDefinition.name).toBe('run_public_dashcard_query');
    expect(runPublicDashcardQueryDefinition.description).toBe('Run a query for a public dashboard dashcard in Metabase');
    expect(runPublicDashcardQueryDefinition.inputSchema).toEqual(RunPublicDashcardQuerySchema);
  });
});
