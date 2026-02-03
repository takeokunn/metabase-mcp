import { CreateDashboardPublicLinkInputSchema } from '@src/schemas/dashboard';
import { createDashboardPublicLinkDefinition } from '@src/tools/dashboard/create-dashboard-public-link';
import { describe, expect, it } from 'vitest';

import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('createDashboardPublicLink tool', () => {
  const baseInput = {
    dashboard_id: 1,
  };

  it('should return formatted MCP response with public link UUID', async () => {
    const mockResponse = {
      uuid: '550e8400-e29b-41d4-a716-446655440000',
    };

    const mockClient = createMockClientWithResponse('post', mockResponse);

    const result = await createDashboardPublicLinkDefinition.handler(mockClient, baseInput);

    expectMcpContent(result, mockResponse);
    expect(mockClient.post).toHaveBeenCalledWith('/api/dashboard/1/public_link', {});
    expect(mockClient.post).toHaveBeenCalledOnce();
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('post', 'Failed to create public link');

    await expect(
      createDashboardPublicLinkDefinition.handler(mockClient, baseInput),
    ).rejects.toThrow('Failed to create public link');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError(
      'post',
      createApiError('Dashboard not found', 404),
    );

    await expect(
      createDashboardPublicLinkDefinition.handler(mockClient, baseInput),
    ).rejects.toThrow('Dashboard not found');
  });

  it('should propagate permission errors', async () => {
    const mockClient = createMockClientWithError('post', createApiError('Permission denied', 403));

    await expect(
      createDashboardPublicLinkDefinition.handler(mockClient, baseInput),
    ).rejects.toThrow('Permission denied');
  });

  it('should have correct tool definition metadata', () => {
    expect(createDashboardPublicLinkDefinition.name).toBe('create_dashboard_public_link');
    expect(createDashboardPublicLinkDefinition.description).toBe(
      'Create a public sharing link for a dashboard in Metabase (returns UUID)',
    );
    expect(createDashboardPublicLinkDefinition.inputSchema).toEqual(
      CreateDashboardPublicLinkInputSchema,
    );
  });
});
