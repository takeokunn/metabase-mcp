import { ExportCardQueryParamsSchema } from '@src/schemas/card';
import { exportCardQueryDefinition } from '@src/tools/card/export-card-query';
import { describe, expect, it } from 'vitest';

import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('exportCardQuery tool', () => {
  const baseInput = { id: 1, export_format: 'csv' as const };

  it('should return formatted MCP response for csv export', async () => {
    const mockResult = 'id,name\n1,Product A\n';
    const mockClient = createMockClientWithResponse('post', mockResult);

    const result = await exportCardQueryDefinition.handler(mockClient, baseInput);

    expectMcpContent(result, mockResult);
    expect(mockClient.post).toHaveBeenCalledWith('/api/card/1/query/csv', {});
    expect(mockClient.post).toHaveBeenCalledOnce();
  });

  it('should support json export format', async () => {
    const mockResult = [{ id: 1, name: 'Product A' }];
    const mockClient = createMockClientWithResponse('post', mockResult);

    const result = await exportCardQueryDefinition.handler(mockClient, {
      id: 2,
      export_format: 'json',
    });

    expectMcpContent(result, mockResult);
    expect(mockClient.post).toHaveBeenCalledWith('/api/card/2/query/json', {});
  });

  it('should support xlsx export format', async () => {
    const mockResult = Buffer.from('xlsx data');
    const mockClient = createMockClientWithResponse('post', mockResult);

    await exportCardQueryDefinition.handler(mockClient, { id: 3, export_format: 'xlsx' });

    expect(mockClient.post).toHaveBeenCalledWith('/api/card/3/query/xlsx', {});
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('post', 'Card not found');
    await expect(exportCardQueryDefinition.handler(mockClient, baseInput)).rejects.toThrow(
      'Card not found',
    );
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('post', createApiError('Unauthorized', 401));
    await expect(exportCardQueryDefinition.handler(mockClient, baseInput)).rejects.toThrow(
      'Unauthorized',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(exportCardQueryDefinition.name).toBe('export_card_query');
    expect(exportCardQueryDefinition.inputSchema).toEqual(ExportCardQueryParamsSchema);
  });
});
