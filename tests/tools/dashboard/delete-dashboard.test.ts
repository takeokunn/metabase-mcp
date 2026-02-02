import type { MetabaseClient } from '@src/client';
import { DeleteDashboardInputSchema } from '@src/schemas/dashboard';
import { deleteDashboardDefinition } from '@src/tools/dashboard/delete-dashboard';
import { describe, expect, it, vi } from 'vitest';

describe('deleteDashboard tool', () => {
  it('should return formatted MCP response after deleting dashboard', async () => {
    const mockResult = { success: true };

    const mockClient = {
      delete: vi.fn().mockResolvedValue(mockResult),
    } as unknown as MetabaseClient;

    const result = await deleteDashboardDefinition.handler(mockClient, { id: 1 });

    expect(result.content).toHaveLength(1);
    expect(result.content[0].type).toBe('text');
    expect(JSON.parse((result.content[0] as { text: string }).text)).toEqual(mockResult);
    expect(mockClient.delete).toHaveBeenCalledWith('/api/dashboard/1');
    expect(mockClient.delete).toHaveBeenCalledOnce();
  });

  it('should delete dashboard with different ID', async () => {
    const mockResult = { success: true };

    const mockClient = {
      delete: vi.fn().mockResolvedValue(mockResult),
    } as unknown as MetabaseClient;

    const result = await deleteDashboardDefinition.handler(mockClient, { id: 42 });

    expect(result.content[0].type).toBe('text');
    expect(JSON.parse((result.content[0] as { text: string }).text)).toEqual(mockResult);
    expect(mockClient.delete).toHaveBeenCalledWith('/api/dashboard/42');
  });

  it('should propagate client errors', async () => {
    const mockClient = {
      delete: vi.fn().mockRejectedValue(new Error('Dashboard not found')),
    } as unknown as MetabaseClient;

    await expect(deleteDashboardDefinition.handler(mockClient, { id: 999 })).rejects.toThrow(
      'Dashboard not found',
    );
    expect(mockClient.delete).toHaveBeenCalledWith('/api/dashboard/999');
  });

  it('should propagate API errors with status codes', async () => {
    const apiError = new Error('Forbidden');
    (apiError as Error & { status?: number }).status = 403;

    const mockClient = {
      delete: vi.fn().mockRejectedValue(apiError),
    } as unknown as MetabaseClient;

    await expect(deleteDashboardDefinition.handler(mockClient, { id: 1 })).rejects.toThrow(
      'Forbidden',
    );
  });

  it('should propagate unauthorized errors', async () => {
    const apiError = new Error('Unauthorized');
    (apiError as Error & { status?: number }).status = 401;

    const mockClient = {
      delete: vi.fn().mockRejectedValue(apiError),
    } as unknown as MetabaseClient;

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
