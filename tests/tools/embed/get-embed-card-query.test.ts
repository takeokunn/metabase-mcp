import { GetEmbedCardQueryParamsSchema } from '@src/schemas/embed';
import { getEmbedCardQueryDefinition } from '@src/tools/embed/get-embed-card-query';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('getEmbedCardQuery tool', () => {
  const input = { token: 'test-embed-token-abc123' };

  it('should return formatted MCP response', async () => {
    const mockResult = { data: { rows: [[1, 'Alice']], cols: [{ name: 'id' }, { name: 'name' }] } };
    const mockClient = createMockClientWithResponse('get', mockResult);
    const result = await getEmbedCardQueryDefinition.handler(mockClient, input);
    expectMcpContent(result, mockResult);
    expect(mockClient.get).toHaveBeenCalledWith(`/api/embed/card/${input.token}/query`);
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'API error');
    await expect(getEmbedCardQueryDefinition.handler(mockClient, input)).rejects.toThrow('API error');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Unauthorized', 401));
    await expect(getEmbedCardQueryDefinition.handler(mockClient, input)).rejects.toThrow('Unauthorized');
  });

  it('should have correct tool definition metadata', () => {
    expect(getEmbedCardQueryDefinition.name).toBe('get_embed_card_query');
    expect(getEmbedCardQueryDefinition.inputSchema).toEqual(GetEmbedCardQueryParamsSchema);
  });
});
