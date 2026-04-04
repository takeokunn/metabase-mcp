import { GetEmbedCardQueryFormatParamsSchema } from '@src/schemas/embed';
import { getEmbedCardQueryFormatDefinition } from '@src/tools/embed/get-embed-card-query-format';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('getEmbedCardQueryFormat tool', () => {
  const input = { token: 'test-embed-token-abc123', export_format: 'csv' as const };

  it('should return formatted MCP response', async () => {
    const mockResult = 'id,name\n1,Alice\n';
    const mockClient = createMockClientWithResponse('get', mockResult);
    const result = await getEmbedCardQueryFormatDefinition.handler(mockClient, input);
    expectMcpContent(result, mockResult);
    expect(mockClient.get).toHaveBeenCalledWith(
      `/api/embed/card/${input.token}/query/${input.export_format}`,
    );
  });

  it('should work with all export formats', async () => {
    for (const fmt of ['csv', 'json', 'xlsx', 'pdf'] as const) {
      const mockClient = createMockClientWithResponse('get', {});
      await getEmbedCardQueryFormatDefinition.handler(mockClient, { ...input, export_format: fmt });
      expect(mockClient.get).toHaveBeenCalledWith(
        `/api/embed/card/${input.token}/query/${fmt}`,
      );
    }
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'API error');
    await expect(getEmbedCardQueryFormatDefinition.handler(mockClient, input)).rejects.toThrow('API error');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Forbidden', 403));
    await expect(getEmbedCardQueryFormatDefinition.handler(mockClient, input)).rejects.toThrow('Forbidden');
  });

  it('should have correct tool definition metadata', () => {
    expect(getEmbedCardQueryFormatDefinition.name).toBe('get_embed_card_query_format');
    expect(getEmbedCardQueryFormatDefinition.inputSchema).toEqual(GetEmbedCardQueryFormatParamsSchema);
  });
});
