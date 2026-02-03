import { ListPublicDashboardsParamsSchema } from '@src/schemas/dashboard';
import { listPublicDashboardsDefinition } from '@src/tools/dashboard/list-public-dashboards';
import { describe, expect, it } from 'vitest';

import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('listPublicDashboards tool', () => {
  const baseInput = {};

  it('should return formatted MCP response with public dashboards', async () => {
    const mockResponse = [
      { id: 1, name: 'Public Dashboard 1', uuid: '550e8400-e29b-41d4-a716-446655440000' },
      { id: 2, name: 'Public Dashboard 2', uuid: '550e8400-e29b-41d4-a716-446655440001' },
    ];

    const mockClient = createMockClientWithResponse('get', mockResponse);

    const result = await listPublicDashboardsDefinition.handler(mockClient, baseInput);

    expectMcpContent(result, mockResponse);
    expect(mockClient.get).toHaveBeenCalledWith('/api/dashboard/public');
    expect(mockClient.get).toHaveBeenCalledOnce();
  });

  it('should handle empty list', async () => {
    const mockClient = createMockClientWithResponse('get', []);

    const result = await listPublicDashboardsDefinition.handler(mockClient, baseInput);

    expectMcpContent(result, []);
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'Failed to list public dashboards');

    await expect(listPublicDashboardsDefinition.handler(mockClient, baseInput)).rejects.toThrow(
      'Failed to list public dashboards',
    );
  });

  it('should propagate API errors with status codes (superuser only)', async () => {
    const mockClient = createMockClientWithError(
      'get',
      createApiError('Forbidden - Superuser only', 403),
    );

    await expect(listPublicDashboardsDefinition.handler(mockClient, baseInput)).rejects.toThrow(
      'Forbidden - Superuser only',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(listPublicDashboardsDefinition.name).toBe('list_public_dashboards');
    expect(listPublicDashboardsDefinition.description).toBe(
      'List all dashboards with public sharing links in Metabase (superuser only)',
    );
    expect(listPublicDashboardsDefinition.inputSchema).toEqual(ListPublicDashboardsParamsSchema);
  });
});
