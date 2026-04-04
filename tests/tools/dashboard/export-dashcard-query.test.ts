import { ExportDashcardQueryInputSchema } from '@src/schemas/dashboard';
import { exportDashcardQueryDefinition } from '@src/tools/dashboard/export-dashcard-query';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('exportDashcardQuery tool', () => {
  it('should return formatted MCP response with export data', async () => {
    const mockClient = createMockClientWithResponse('post', 'col1,col2\nval1,val2');
    const result = await exportDashcardQueryDefinition.handler(mockClient, { dashboard_id: 1, dashcard_id: 2, card_id: 3, export_format: 'csv' });
    expectMcpContent(result, 'col1,col2\nval1,val2');
    expect(mockClient.post).toHaveBeenCalledWith('/api/dashboard/1/dashcard/2/card/3/query/csv', { parameters: [] });
    expect(mockClient.post).toHaveBeenCalledOnce();
  });
  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('post', 'Not found');
    await expect(exportDashcardQueryDefinition.handler(mockClient, { dashboard_id: 999, dashcard_id: 1, card_id: 1, export_format: 'json' })).rejects.toThrow('Not found');
  });
  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('post', createApiError('Unauthorized', 401));
    await expect(exportDashcardQueryDefinition.handler(mockClient, { dashboard_id: 1, dashcard_id: 1, card_id: 1, export_format: 'xlsx' })).rejects.toThrow('Unauthorized');
  });
  it('should have correct tool definition metadata', () => {
    expect(exportDashcardQueryDefinition.name).toBe('export_dashcard_query');
    expect(exportDashcardQueryDefinition.description).toBe('Export query results for a dashcard in Metabase');
    expect(exportDashcardQueryDefinition.inputSchema).toEqual(ExportDashcardQueryInputSchema);
  });
});
