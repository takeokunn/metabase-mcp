import { GetPublicDashcardQuerySchema } from '@src/schemas/public';
import { getPublicDashcardQueryDefinition } from '@src/tools/public/run-public-dashcard-query-get';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('getPublicDashcardQuery tool', () => {
  const input = {
    uuid: '550e8400-e29b-41d4-a716-446655440000',
    dashcard_id: 42,
    card_id: 1,
  };

  it('should return formatted MCP response', async () => {
    const mockResult = { data: { rows: [] } };
    const mockClient = createMockClientWithResponse('get', mockResult);
    const result = await getPublicDashcardQueryDefinition.handler(mockClient, input);
    expectMcpContent(result, mockResult);
    expect(mockClient.get).toHaveBeenCalledWith(
      `/api/public/dashboard/${input.uuid}/dashcard/${input.dashcard_id}/card/${input.card_id}/query`,
    );
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'API error');
    await expect(getPublicDashcardQueryDefinition.handler(mockClient, input)).rejects.toThrow(
      'API error',
    );
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Not Found', 404));
    await expect(getPublicDashcardQueryDefinition.handler(mockClient, input)).rejects.toThrow(
      'Not Found',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(getPublicDashcardQueryDefinition.name).toBe('get_public_dashcard_query');
    expect(getPublicDashcardQueryDefinition.description).toBe(
      'Get query results for a public dashcard in Metabase',
    );
    expect(getPublicDashcardQueryDefinition.inputSchema).toEqual(GetPublicDashcardQuerySchema);
  });
});
