import { ExportEmbedCardQuerySchema } from '@src/schemas/embed';
import { exportEmbedCardQueryDefinition } from '@src/tools/embed/export-embed-card-query';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('exportEmbedCardQuery tool', () => {
  const input = { token: 'test-embed-token-abc123', export_format: 'csv' as const };

  it('should return formatted MCP response', async () => {
    const mockResult = 'col1,col2\nval1,val2';
    const mockClient = createMockClientWithResponse('get', mockResult);
    const result = await exportEmbedCardQueryDefinition.handler(mockClient, input);
    expectMcpContent(result, mockResult);
    expect(mockClient.get).toHaveBeenCalledWith(
      `/api/embed/card/${input.token}/query/${input.export_format}`,
    );
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'API error');
    await expect(exportEmbedCardQueryDefinition.handler(mockClient, input)).rejects.toThrow('API error');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Not Found', 404));
    await expect(exportEmbedCardQueryDefinition.handler(mockClient, input)).rejects.toThrow('Not Found');
  });

  it('should have correct tool definition metadata', () => {
    expect(exportEmbedCardQueryDefinition.name).toBe('export_embed_card_query');
    expect(exportEmbedCardQueryDefinition.description).toBe('Export results of an embedded card query in Metabase');
    expect(exportEmbedCardQueryDefinition.inputSchema).toEqual(ExportEmbedCardQuerySchema);
  });
});
