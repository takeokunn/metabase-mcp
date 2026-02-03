import { RevertDashboardInputSchema } from '@src/schemas/dashboard';
import { revertDashboardDefinition } from '@src/tools/dashboard/revert-dashboard';
import { describe, expect, it } from 'vitest';

import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('revertDashboard tool', () => {
  const baseInput = {
    dashboard_id: 1,
    revision_id: 5,
  };

  it('should return formatted MCP response when reverting', async () => {
    const mockResponse = {
      id: 1,
      name: 'Reverted Dashboard',
      description: 'Dashboard reverted to revision 5',
    };

    const mockClient = createMockClientWithResponse('post', mockResponse);

    const result = await revertDashboardDefinition.handler(mockClient, baseInput);

    expectMcpContent(result, mockResponse);
    expect(mockClient.post).toHaveBeenCalledWith('/api/dashboard/1/revert', {
      revision_id: 5,
    });
    expect(mockClient.post).toHaveBeenCalledOnce();
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('post', 'Failed to revert dashboard');

    await expect(revertDashboardDefinition.handler(mockClient, baseInput)).rejects.toThrow(
      'Failed to revert dashboard',
    );
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError(
      'post',
      createApiError('Dashboard not found', 404),
    );

    await expect(revertDashboardDefinition.handler(mockClient, baseInput)).rejects.toThrow(
      'Dashboard not found',
    );
  });

  it('should propagate revision not found errors', async () => {
    const mockClient = createMockClientWithError('post', createApiError('Revision not found', 404));

    await expect(revertDashboardDefinition.handler(mockClient, baseInput)).rejects.toThrow(
      'Revision not found',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(revertDashboardDefinition.name).toBe('revert_dashboard');
    expect(revertDashboardDefinition.description).toBe(
      'Revert a dashboard to a previous revision in Metabase',
    );
    expect(revertDashboardDefinition.inputSchema).toEqual(RevertDashboardInputSchema);
  });
});
