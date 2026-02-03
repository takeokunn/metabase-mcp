import { GetDashboardParamsSchema } from '@src/schemas/dashboard';
import { getDashboardMetadataDefinition } from '@src/tools/dashboard/get-dashboard-metadata';
import { describe, expect, it } from 'vitest';

import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('getDashboardMetadata tool', () => {
  it('should return formatted MCP response with dashboard metadata', async () => {
    const mockMetadata = {
      tables: [
        { id: 1, name: 'orders', schema: 'public' },
        { id: 2, name: 'products', schema: 'public' },
      ],
      databases: [{ id: 1, name: 'Sample Database' }],
      cards: [
        { id: 10, name: 'Sales Chart' },
        { id: 11, name: 'Revenue Table' },
      ],
    };

    const mockClient = createMockClientWithResponse('get', mockMetadata);

    const result = await getDashboardMetadataDefinition.handler(mockClient, { id: 1 });

    expectMcpContent(result, mockMetadata);
    expect(mockClient.get).toHaveBeenCalledWith('/api/dashboard/1/query_metadata');
    expect(mockClient.get).toHaveBeenCalledOnce();
  });

  it('should handle metadata with multiple databases', async () => {
    const mockMetadata = {
      tables: [
        { id: 1, name: 'users', schema: 'public' },
        { id: 5, name: 'analytics', schema: 'reporting' },
      ],
      databases: [
        { id: 1, name: 'Production DB' },
        { id: 2, name: 'Analytics DB' },
      ],
    };

    const mockClient = createMockClientWithResponse('get', mockMetadata);

    const result = await getDashboardMetadataDefinition.handler(mockClient, { id: 42 });

    const parsedResult = JSON.parse((result.content[0] as { text: string }).text);
    expect(parsedResult.databases).toHaveLength(2);
    expect(mockClient.get).toHaveBeenCalledWith('/api/dashboard/42/query_metadata');
  });

  it('should handle minimal metadata', async () => {
    const mockMetadata = {
      tables: [],
      databases: [],
    };

    const mockClient = createMockClientWithResponse('get', mockMetadata);

    const result = await getDashboardMetadataDefinition.handler(mockClient, { id: 5 });

    expectMcpContent(result, mockMetadata);
  });

  it('should handle metadata with parameters', async () => {
    const mockMetadata = {
      tables: [{ id: 1, name: 'sales' }],
      databases: [{ id: 1, name: 'Main DB' }],
      parameters: [
        { id: 'date_range', type: 'date/range', name: 'Date Range' },
        { id: 'category', type: 'string/=', name: 'Category' },
      ],
    };

    const mockClient = createMockClientWithResponse('get', mockMetadata);

    const result = await getDashboardMetadataDefinition.handler(mockClient, { id: 10 });

    const parsedResult = JSON.parse((result.content[0] as { text: string }).text);
    expect(parsedResult.parameters).toHaveLength(2);
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'Dashboard not found');

    await expect(getDashboardMetadataDefinition.handler(mockClient, { id: 999 })).rejects.toThrow(
      'Dashboard not found',
    );
    expect(mockClient.get).toHaveBeenCalledWith('/api/dashboard/999/query_metadata');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Unauthorized', 401));

    await expect(getDashboardMetadataDefinition.handler(mockClient, { id: 1 })).rejects.toThrow(
      'Unauthorized',
    );
  });

  it('should propagate forbidden errors', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Forbidden', 403));

    await expect(getDashboardMetadataDefinition.handler(mockClient, { id: 1 })).rejects.toThrow(
      'Forbidden',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(getDashboardMetadataDefinition.name).toBe('get_dashboard_metadata');
    expect(getDashboardMetadataDefinition.description).toBe(
      'Get dashboard query metadata from Metabase',
    );
    expect(getDashboardMetadataDefinition.inputSchema).toEqual(GetDashboardParamsSchema);
  });
});
