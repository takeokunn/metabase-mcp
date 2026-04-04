import { ExportPublicDashcardQueryFormatSchema } from '@src/schemas/public';
import { exportPublicDashcardQueryFormatDefinition } from '@src/tools/public/export-public-dashcard-query-format';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('exportPublicDashcardQueryFormat tool', () => {
  const input = {
    uuid: '550e8400-e29b-41d4-a716-446655440000',
    dashcard_id: 10,
    card_id: 42,
    export_format: 'json',
  };

  it('should return formatted MCP response', async () => {
    const mockResult = { data: 'exported-data' };
    const mockClient = createMockClientWithResponse('post', mockResult);
    const result = await exportPublicDashcardQueryFormatDefinition.handler(mockClient, input);
    expectMcpContent(result, mockResult);
    expect(mockClient.post).toHaveBeenCalledWith(
      '/api/public/dashboard/550e8400-e29b-41d4-a716-446655440000/dashcard/10/card/42/json',
      {},
    );
    expect(mockClient.post).toHaveBeenCalledOnce();
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('post', 'API error');
    await expect(
      exportPublicDashcardQueryFormatDefinition.handler(mockClient, input),
    ).rejects.toThrow('API error');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('post', createApiError('Not Found', 404));
    await expect(
      exportPublicDashcardQueryFormatDefinition.handler(mockClient, input),
    ).rejects.toThrow('Not Found');
  });

  it('should have correct tool definition metadata', () => {
    expect(exportPublicDashcardQueryFormatDefinition.name).toBe(
      'export_public_dashcard_query_format',
    );
    expect(exportPublicDashcardQueryFormatDefinition.description).toBe(
      'Export results of a public dashboard card query in a specific format in Metabase',
    );
    expect(exportPublicDashcardQueryFormatDefinition.inputSchema).toEqual(
      ExportPublicDashcardQueryFormatSchema,
    );
  });
});
