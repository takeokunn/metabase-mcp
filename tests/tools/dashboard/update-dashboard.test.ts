import type { MetabaseClient } from '@src/client';
import { UpdateDashboardInputSchema } from '@src/schemas/dashboard';
import { updateDashboardDefinition } from '@src/tools/dashboard/update-dashboard';
import { describe, expect, it, vi } from 'vitest';

describe('updateDashboard tool', () => {
  it('should return formatted MCP response with updated dashboard', async () => {
    const mockUpdatedDashboard = {
      id: 1,
      name: 'Updated Executive Dashboard',
      description: 'Updated metrics',
      collection_id: 5,
    };

    const mockClient = {
      put: vi.fn().mockResolvedValue(mockUpdatedDashboard),
    } as unknown as MetabaseClient;

    const result = await updateDashboardDefinition.handler(mockClient, {
      id: 1,
      name: 'Updated Executive Dashboard',
      description: 'Updated metrics',
    });

    expect(result.content).toHaveLength(1);
    expect(result.content[0].type).toBe('text');
    expect(JSON.parse((result.content[0] as { text: string }).text)).toEqual(mockUpdatedDashboard);
    expect(mockClient.put).toHaveBeenCalledWith('/api/dashboard/1', {
      name: 'Updated Executive Dashboard',
      description: 'Updated metrics',
    });
    expect(mockClient.put).toHaveBeenCalledOnce();
  });

  it('should update dashboard name only', async () => {
    const mockUpdatedDashboard = {
      id: 42,
      name: 'New Dashboard Name',
      collection_id: null,
    };

    const mockClient = {
      put: vi.fn().mockResolvedValue(mockUpdatedDashboard),
    } as unknown as MetabaseClient;

    const result = await updateDashboardDefinition.handler(mockClient, {
      id: 42,
      name: 'New Dashboard Name',
    });

    expect(result.content[0].type).toBe('text');
    expect(JSON.parse((result.content[0] as { text: string }).text)).toEqual(mockUpdatedDashboard);
    expect(mockClient.put).toHaveBeenCalledWith('/api/dashboard/42', {
      name: 'New Dashboard Name',
    });
  });

  it('should update dashboard description only', async () => {
    const mockUpdatedDashboard = {
      id: 5,
      name: 'My Dashboard',
      description: 'Updated description for the dashboard',
    };

    const mockClient = {
      put: vi.fn().mockResolvedValue(mockUpdatedDashboard),
    } as unknown as MetabaseClient;

    const result = await updateDashboardDefinition.handler(mockClient, {
      id: 5,
      description: 'Updated description for the dashboard',
    });

    expect(result.content[0].type).toBe('text');
    expect(mockClient.put).toHaveBeenCalledWith('/api/dashboard/5', {
      description: 'Updated description for the dashboard',
    });
  });

  it('should update dashboard collection_id', async () => {
    const mockUpdatedDashboard = {
      id: 3,
      name: 'Moved Dashboard',
      collection_id: 10,
    };

    const mockClient = {
      put: vi.fn().mockResolvedValue(mockUpdatedDashboard),
    } as unknown as MetabaseClient;

    const result = await updateDashboardDefinition.handler(mockClient, {
      id: 3,
      collection_id: 10,
    });

    expect(result.content[0].type).toBe('text');
    expect(JSON.parse((result.content[0] as { text: string }).text)).toEqual(mockUpdatedDashboard);
    expect(mockClient.put).toHaveBeenCalledWith('/api/dashboard/3', {
      collection_id: 10,
    });
  });

  it('should move dashboard to root collection with null collection_id', async () => {
    const mockUpdatedDashboard = {
      id: 7,
      name: 'Root Dashboard',
      collection_id: null,
    };

    const mockClient = {
      put: vi.fn().mockResolvedValue(mockUpdatedDashboard),
    } as unknown as MetabaseClient;

    const result = await updateDashboardDefinition.handler(mockClient, {
      id: 7,
      collection_id: null,
    });

    expect(result.content[0].type).toBe('text');
    expect(mockClient.put).toHaveBeenCalledWith('/api/dashboard/7', {
      collection_id: null,
    });
  });

  it('should update multiple fields at once', async () => {
    const mockUpdatedDashboard = {
      id: 10,
      name: 'Comprehensive Update',
      description: 'New description',
      collection_id: 5,
    };

    const mockClient = {
      put: vi.fn().mockResolvedValue(mockUpdatedDashboard),
    } as unknown as MetabaseClient;

    const result = await updateDashboardDefinition.handler(mockClient, {
      id: 10,
      name: 'Comprehensive Update',
      description: 'New description',
      collection_id: 5,
    });

    expect(result.content[0].type).toBe('text');
    expect(mockClient.put).toHaveBeenCalledWith('/api/dashboard/10', {
      name: 'Comprehensive Update',
      description: 'New description',
      collection_id: 5,
    });
  });

  it('should propagate client errors', async () => {
    const mockClient = {
      put: vi.fn().mockRejectedValue(new Error('Dashboard not found')),
    } as unknown as MetabaseClient;

    await expect(
      updateDashboardDefinition.handler(mockClient, { id: 999, name: 'Test' }),
    ).rejects.toThrow('Dashboard not found');
    expect(mockClient.put).toHaveBeenCalledWith('/api/dashboard/999', { name: 'Test' });
  });

  it('should propagate API errors with status codes', async () => {
    const apiError = new Error('Bad Request');
    (apiError as Error & { status?: number }).status = 400;

    const mockClient = {
      put: vi.fn().mockRejectedValue(apiError),
    } as unknown as MetabaseClient;

    await expect(
      updateDashboardDefinition.handler(mockClient, { id: 1, name: 'Test' }),
    ).rejects.toThrow('Bad Request');
  });

  it('should propagate forbidden errors', async () => {
    const apiError = new Error('Forbidden');
    (apiError as Error & { status?: number }).status = 403;

    const mockClient = {
      put: vi.fn().mockRejectedValue(apiError),
    } as unknown as MetabaseClient;

    await expect(
      updateDashboardDefinition.handler(mockClient, { id: 1, name: 'Test' }),
    ).rejects.toThrow('Forbidden');
  });

  it('should have correct tool definition metadata', () => {
    expect(updateDashboardDefinition.name).toBe('update_dashboard');
    expect(updateDashboardDefinition.description).toBe('Update an existing dashboard in Metabase');
    expect(updateDashboardDefinition.inputSchema).toEqual(UpdateDashboardInputSchema);
  });
});
