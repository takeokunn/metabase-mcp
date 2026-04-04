import { ExportDashboardCardQueryInputSchema } from '@src/schemas/dashboard';
import { exportDashboardCardQueryDefinition } from '@src/tools/dashboard/export-dashboard-card-query';
import { describe, expect, it } from 'vitest';

import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('exportDashboardCardQuery tool', () => {
  const baseInput = { id: 1, dashcard_id: 2, card_id: 3, export_format: 'csv' as const };

  it('should return formatted MCP response for csv export', async () => {
    const mockResult = 'id,name\n1,Product A\n';
    const mockClient = createMockClientWithResponse('post', mockResult);

    const result = await exportDashboardCardQueryDefinition.handler(mockClient, baseInput);

    expectMcpContent(result, mockResult);
    expect(mockClient.post).toHaveBeenCalledWith(
      '/api/dashboard/1/dashcard/2/card/3/query/csv',
      { parameters: [] },
    );
    expect(mockClient.post).toHaveBeenCalledOnce();
  });

  it('should support json export format', async () => {
    const mockResult = [{ id: 1, name: 'Product A' }];
    const mockClient = createMockClientWithResponse('post', mockResult);

    const result = await exportDashboardCardQueryDefinition.handler(mockClient, {
      ...baseInput,
      export_format: 'json',
    });

    expectMcpContent(result, mockResult);
    expect(mockClient.post).toHaveBeenCalledWith(
      '/api/dashboard/1/dashcard/2/card/3/query/json',
      { parameters: [] },
    );
  });

  it('should pass provided parameters', async () => {
    const mockResult = 'id,name\n1,A\n';
    const mockClient = createMockClientWithResponse('post', mockResult);
    const params = [{ id: 'param1', value: 'bar' }];

    await exportDashboardCardQueryDefinition.handler(mockClient, {
      ...baseInput,
      parameters: params,
    });

    expect(mockClient.post).toHaveBeenCalledWith(
      '/api/dashboard/1/dashcard/2/card/3/query/csv',
      { parameters: params },
    );
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('post', 'Dashboard not found');
    await expect(
      exportDashboardCardQueryDefinition.handler(mockClient, baseInput),
    ).rejects.toThrow('Dashboard not found');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('post', createApiError('Unauthorized', 401));
    await expect(
      exportDashboardCardQueryDefinition.handler(mockClient, baseInput),
    ).rejects.toThrow('Unauthorized');
  });

  it('should have correct tool definition metadata', () => {
    expect(exportDashboardCardQueryDefinition.name).toBe('export_dashboard_card_query');
    expect(exportDashboardCardQueryDefinition.inputSchema).toEqual(
      ExportDashboardCardQueryInputSchema,
    );
  });
});
