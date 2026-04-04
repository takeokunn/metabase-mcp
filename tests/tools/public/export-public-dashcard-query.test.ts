import { ExportPublicDashcardQuerySchema } from '@src/schemas/public';
import { exportPublicDashcardQueryDefinition } from '@src/tools/public/export-public-dashcard-query';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('exportPublicDashcardQuery tool', () => {
  const input = {
    uuid: '550e8400-e29b-41d4-a716-446655440000',
    dashcard_id: 42,
    card_id: 1,
    export_format: 'csv' as const,
  };

  it('should return formatted MCP response', async () => {
    const mockResult = 'id,name\n1,Test';
    const mockClient = createMockClientWithResponse('post', mockResult);
    const result = await exportPublicDashcardQueryDefinition.handler(mockClient, input);
    expectMcpContent(result, mockResult);
    expect(mockClient.post).toHaveBeenCalledWith(
      `/api/public/dashboard/${input.uuid}/dashcard/${input.dashcard_id}/card/${input.card_id}/${input.export_format}`,
      {},
    );
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('post', 'API error');
    await expect(exportPublicDashcardQueryDefinition.handler(mockClient, input)).rejects.toThrow(
      'API error',
    );
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('post', createApiError('Not Found', 404));
    await expect(exportPublicDashcardQueryDefinition.handler(mockClient, input)).rejects.toThrow(
      'Not Found',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(exportPublicDashcardQueryDefinition.name).toBe('export_public_dashcard_query');
    expect(exportPublicDashcardQueryDefinition.description).toBe(
      'Export results of a public dashcard query in Metabase',
    );
    expect(exportPublicDashcardQueryDefinition.inputSchema).toEqual(ExportPublicDashcardQuerySchema);
  });
});
