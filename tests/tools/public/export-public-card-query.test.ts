import { ExportPublicCardQuerySchema } from '@src/schemas/public';
import { exportPublicCardQueryDefinition } from '@src/tools/public/export-public-card-query';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('exportPublicCardQuery tool', () => {
  const input = { uuid: '550e8400-e29b-41d4-a716-446655440000', export_format: 'csv' as const };

  it('should return formatted MCP response', async () => {
    const mockResult = 'id,name\n1,Test';
    const mockClient = createMockClientWithResponse('get', mockResult);
    const result = await exportPublicCardQueryDefinition.handler(mockClient, input);
    expectMcpContent(result, mockResult);
    expect(mockClient.get).toHaveBeenCalledWith(
      `/api/public/card/${input.uuid}/query/${input.export_format}`,
    );
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'API error');
    await expect(exportPublicCardQueryDefinition.handler(mockClient, input)).rejects.toThrow(
      'API error',
    );
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Not Found', 404));
    await expect(exportPublicCardQueryDefinition.handler(mockClient, input)).rejects.toThrow(
      'Not Found',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(exportPublicCardQueryDefinition.name).toBe('export_public_card_query');
    expect(exportPublicCardQueryDefinition.description).toBe(
      'Export results of a public card query in Metabase',
    );
    expect(exportPublicCardQueryDefinition.inputSchema).toEqual(ExportPublicCardQuerySchema);
  });
});
