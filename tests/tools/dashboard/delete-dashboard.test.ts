import { DeleteDashboardInputSchema } from '@src/schemas/dashboard';
import { deleteDashboardDefinition } from '@src/tools/dashboard/delete-dashboard';
import { describe, expect, it } from 'vitest';

import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('deleteDashboard tool', () => {
  it('should return formatted MCP response after deleting dashboard', async () => {
    const mockResult = { success: true };

    const mockClient = createMockClientWithResponse('delete', mockResult);

    const result = await deleteDashboardDefinition.handler(mockClient, { id: 1 });

    expectMcpContent(result, mockResult);
    expect(mockClient.delete).toHaveBeenCalledWith('/api/dashboard/1');
    expect(mockClient.delete).toHaveBeenCalledOnce();
  });

  it('should delete dashboard with different ID', async () => {
    const mockResult = { success: true };

    const mockClient = createMockClientWithResponse('delete', mockResult);

    const result = await deleteDashboardDefinition.handler(mockClient, { id: 42 });

    expectMcpContent(result, mockResult);
    expect(mockClient.delete).toHaveBeenCalledWith('/api/dashboard/42');
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('delete', 'Dashboard not found');

    await expect(deleteDashboardDefinition.handler(mockClient, { id: 999 })).rejects.toThrow(
      'Dashboard not found',
    );
    expect(mockClient.delete).toHaveBeenCalledWith('/api/dashboard/999');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('delete', createApiError('Forbidden', 403));

    await expect(deleteDashboardDefinition.handler(mockClient, { id: 1 })).rejects.toThrow(
      'Forbidden',
    );
  });

  it('should propagate unauthorized errors', async () => {
    const mockClient = createMockClientWithError('delete', createApiError('Unauthorized', 401));

    await expect(deleteDashboardDefinition.handler(mockClient, { id: 1 })).rejects.toThrow(
      'Unauthorized',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(deleteDashboardDefinition.name).toBe('delete_dashboard');
    expect(deleteDashboardDefinition.description).toBe('Delete a dashboard from Metabase');
    expect(deleteDashboardDefinition.inputSchema).toEqual(DeleteDashboardInputSchema);
  });
});
