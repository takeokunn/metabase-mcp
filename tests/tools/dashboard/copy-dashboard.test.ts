import type { MetabaseClient } from '@src/client';
import { CopyDashboardInputSchema } from '@src/schemas/dashboard';
import { copyDashboardDefinition } from '@src/tools/dashboard/copy-dashboard';
import { describe, expect, it, vi } from 'vitest';

describe('copyDashboard tool', () => {
  it('should return formatted MCP response with copied dashboard', async () => {
    const mockCopiedDashboard = {
      id: 10,
      name: 'Executive Dashboard (Copy)',
      description: 'High-level business metrics',
      collection_id: 5,
    };

    const mockClient = {
      post: vi.fn().mockResolvedValue(mockCopiedDashboard),
    } as unknown as MetabaseClient;

    const result = await copyDashboardDefinition.handler(mockClient, { id: 1 });

    expect(result.content).toHaveLength(1);
    expect(result.content[0].type).toBe('text');
    expect(JSON.parse((result.content[0] as { text: string }).text)).toEqual(mockCopiedDashboard);
    expect(mockClient.post).toHaveBeenCalledWith('/api/dashboard/1/copy', {});
    expect(mockClient.post).toHaveBeenCalledOnce();
  });

  it('should copy dashboard with custom name', async () => {
    const mockCopiedDashboard = {
      id: 15,
      name: 'My Custom Dashboard Copy',
      collection_id: null,
    };

    const mockClient = {
      post: vi.fn().mockResolvedValue(mockCopiedDashboard),
    } as unknown as MetabaseClient;

    const result = await copyDashboardDefinition.handler(mockClient, {
      id: 5,
      name: 'My Custom Dashboard Copy',
    });

    expect(result.content[0].type).toBe('text');
    expect(JSON.parse((result.content[0] as { text: string }).text)).toEqual(mockCopiedDashboard);
    expect(mockClient.post).toHaveBeenCalledWith('/api/dashboard/5/copy', {
      name: 'My Custom Dashboard Copy',
    });
  });

  it('should copy dashboard to a different collection', async () => {
    const mockCopiedDashboard = {
      id: 20,
      name: 'Copied Dashboard',
      collection_id: 10,
    };

    const mockClient = {
      post: vi.fn().mockResolvedValue(mockCopiedDashboard),
    } as unknown as MetabaseClient;

    const result = await copyDashboardDefinition.handler(mockClient, {
      id: 3,
      collection_id: 10,
    });

    expect(result.content[0].type).toBe('text');
    expect(JSON.parse((result.content[0] as { text: string }).text)).toEqual(mockCopiedDashboard);
    expect(mockClient.post).toHaveBeenCalledWith('/api/dashboard/3/copy', {
      collection_id: 10,
    });
  });

  it('should copy dashboard with both name and collection_id', async () => {
    const mockCopiedDashboard = {
      id: 25,
      name: 'New Dashboard Name',
      collection_id: 15,
    };

    const mockClient = {
      post: vi.fn().mockResolvedValue(mockCopiedDashboard),
    } as unknown as MetabaseClient;

    const result = await copyDashboardDefinition.handler(mockClient, {
      id: 7,
      name: 'New Dashboard Name',
      collection_id: 15,
    });

    expect(result.content[0].type).toBe('text');
    expect(JSON.parse((result.content[0] as { text: string }).text)).toEqual(mockCopiedDashboard);
    expect(mockClient.post).toHaveBeenCalledWith('/api/dashboard/7/copy', {
      name: 'New Dashboard Name',
      collection_id: 15,
    });
  });

  it('should propagate client errors', async () => {
    const mockClient = {
      post: vi.fn().mockRejectedValue(new Error('Dashboard not found')),
    } as unknown as MetabaseClient;

    await expect(copyDashboardDefinition.handler(mockClient, { id: 999 })).rejects.toThrow(
      'Dashboard not found',
    );
    expect(mockClient.post).toHaveBeenCalledWith('/api/dashboard/999/copy', {});
  });

  it('should propagate API errors with status codes', async () => {
    const apiError = new Error('Forbidden');
    (apiError as Error & { status?: number }).status = 403;

    const mockClient = {
      post: vi.fn().mockRejectedValue(apiError),
    } as unknown as MetabaseClient;

    await expect(copyDashboardDefinition.handler(mockClient, { id: 1 })).rejects.toThrow(
      'Forbidden',
    );
  });

  it('should propagate unauthorized errors', async () => {
    const apiError = new Error('Unauthorized');
    (apiError as Error & { status?: number }).status = 401;

    const mockClient = {
      post: vi.fn().mockRejectedValue(apiError),
    } as unknown as MetabaseClient;

    await expect(copyDashboardDefinition.handler(mockClient, { id: 1 })).rejects.toThrow(
      'Unauthorized',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(copyDashboardDefinition.name).toBe('copy_dashboard');
    expect(copyDashboardDefinition.description).toBe('Copy an existing dashboard in Metabase');
    expect(copyDashboardDefinition.inputSchema).toEqual(CopyDashboardInputSchema);
  });
});
