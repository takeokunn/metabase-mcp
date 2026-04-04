import { GetEmbedCardParamsSchema } from '@src/schemas/embed';
import { getEmbedCardDefinition } from '@src/tools/embed/get-embed-card';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('getEmbedCard tool', () => {
  const input = { token: 'test-embed-token-abc123' };

  it('should return formatted MCP response', async () => {
    const mockResult = { id: 1, name: 'Sales Chart' };
    const mockClient = createMockClientWithResponse('get', mockResult);
    const result = await getEmbedCardDefinition.handler(mockClient, input);
    expectMcpContent(result, mockResult);
    expect(mockClient.get).toHaveBeenCalledWith(`/api/embed/card/${input.token}`);
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'API error');
    await expect(getEmbedCardDefinition.handler(mockClient, input)).rejects.toThrow('API error');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Forbidden', 403));
    await expect(getEmbedCardDefinition.handler(mockClient, input)).rejects.toThrow('Forbidden');
  });

  it('should have correct tool definition metadata', () => {
    expect(getEmbedCardDefinition.name).toBe('get_embed_card');
    expect(getEmbedCardDefinition.inputSchema).toEqual(GetEmbedCardParamsSchema);
  });
});
