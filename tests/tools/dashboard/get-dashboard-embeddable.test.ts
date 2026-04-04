import { getDashboardEmbeddableDefinition } from '@src/tools/dashboard/get-dashboard-embeddable';
import { describe, expect, it } from 'vitest';

import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('getDashboardEmbeddable tool', () => {
  it('should return formatted MCP response with embeddable dashboards', async () => {
    const mockResult = [
      { id: 1, name: 'Sales Dashboard' },
      { id: 2, name: 'Finance Dashboard' },
    ];

    const mockClient = createMockClientWithResponse('get', mockResult);
    const result = await getDashboardEmbeddableDefinition.handler(mockClient, {});

    expectMcpContent(result, mockResult);
    expect(mockClient.get).toHaveBeenCalledWith('/api/dashboard/embeddable');
    expect(mockClient.get).toHaveBeenCalledOnce();
  });

  it('should return empty list when no embeddable dashboards exist', async () => {
    const mockClient = createMockClientWithResponse('get', []);
    const result = await getDashboardEmbeddableDefinition.handler(mockClient, {});

    expectMcpContent(result, []);
    expect(mockClient.get).toHaveBeenCalledWith('/api/dashboard/embeddable');
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'Internal server error');
    await expect(getDashboardEmbeddableDefinition.handler(mockClient, {})).rejects.toThrow(
      'Internal server error',
    );
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Forbidden', 403));
    await expect(getDashboardEmbeddableDefinition.handler(mockClient, {})).rejects.toThrow(
      'Forbidden',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(getDashboardEmbeddableDefinition.name).toBe('get_dashboard_embeddable');
    expect(getDashboardEmbeddableDefinition.description).toBe(
      'List all dashboards available for embedding in Metabase (admin only)',
    );
  });
});
