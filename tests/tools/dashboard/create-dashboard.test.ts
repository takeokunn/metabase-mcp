import type { MetabaseClient } from '@src/client';
import { CreateDashboardInputSchema } from '@src/schemas/dashboard';
import { createDashboardDefinition } from '@src/tools/dashboard/create-dashboard';
import { describe, expect, it, vi } from 'vitest';

describe('createDashboard tool', () => {
  const baseDashboardInput = {
    name: 'New Analytics Dashboard',
  };

  it('should return formatted MCP response with created dashboard', async () => {
    const mockCreatedDashboard = {
      id: 42,
      name: 'New Analytics Dashboard',
      description: null,
      collection_id: null,
      parameters: [],
    };

    const mockClient = {
      post: vi.fn().mockResolvedValue(mockCreatedDashboard),
    } as unknown as MetabaseClient;

    const result = await createDashboardDefinition.handler(mockClient, baseDashboardInput);

    expect(result.content).toHaveLength(1);
    expect(result.content[0].type).toBe('text');
    expect(JSON.parse((result.content[0] as { text: string }).text)).toEqual(mockCreatedDashboard);
    expect(mockClient.post).toHaveBeenCalledWith('/api/dashboard', {
      name: 'New Analytics Dashboard',
      description: undefined,
      collection_id: undefined,
      parameters: [],
    });
    expect(mockClient.post).toHaveBeenCalledOnce();
  });

  it('should include optional description when provided', async () => {
    const inputWithDescription = {
      ...baseDashboardInput,
      description: 'Comprehensive analytics overview',
    };

    const mockCreatedDashboard = {
      id: 43,
      name: 'New Analytics Dashboard',
      description: 'Comprehensive analytics overview',
      collection_id: null,
    };

    const mockClient = {
      post: vi.fn().mockResolvedValue(mockCreatedDashboard),
    } as unknown as MetabaseClient;

    const result = await createDashboardDefinition.handler(mockClient, inputWithDescription);

    expect(result.content[0].type).toBe('text');
    expect(mockClient.post).toHaveBeenCalledWith('/api/dashboard', {
      name: 'New Analytics Dashboard',
      description: 'Comprehensive analytics overview',
      collection_id: undefined,
      parameters: [],
    });
  });

  it('should include collection_id when provided', async () => {
    const inputWithCollection = {
      ...baseDashboardInput,
      collection_id: 10,
    };

    const mockCreatedDashboard = {
      id: 44,
      name: 'New Analytics Dashboard',
      description: null,
      collection_id: 10,
    };

    const mockClient = {
      post: vi.fn().mockResolvedValue(mockCreatedDashboard),
    } as unknown as MetabaseClient;

    const result = await createDashboardDefinition.handler(mockClient, inputWithCollection);

    expect(result.content[0].type).toBe('text');
    expect(JSON.parse((result.content[0] as { text: string }).text)).toEqual(mockCreatedDashboard);
    expect(mockClient.post).toHaveBeenCalledWith('/api/dashboard', {
      name: 'New Analytics Dashboard',
      description: undefined,
      collection_id: 10,
      parameters: [],
    });
  });

  it('should include parameters when provided', async () => {
    const inputWithParameters = {
      ...baseDashboardInput,
      parameters: [
        {
          id: 'date_filter',
          name: 'Date Range',
          type: 'date/range',
        },
        {
          id: 'category_filter',
          name: 'Category',
          slug: 'category',
          type: 'category',
        },
      ],
    };

    const mockCreatedDashboard = {
      id: 45,
      name: 'New Analytics Dashboard',
      description: null,
      collection_id: null,
      parameters: inputWithParameters.parameters,
    };

    const mockClient = {
      post: vi.fn().mockResolvedValue(mockCreatedDashboard),
    } as unknown as MetabaseClient;

    const result = await createDashboardDefinition.handler(mockClient, inputWithParameters);

    expect(result.content[0].type).toBe('text');
    expect(JSON.parse((result.content[0] as { text: string }).text)).toEqual(mockCreatedDashboard);
    expect(mockClient.post).toHaveBeenCalledWith('/api/dashboard', {
      name: 'New Analytics Dashboard',
      description: undefined,
      collection_id: undefined,
      parameters: inputWithParameters.parameters,
    });
  });

  it('should propagate client errors', async () => {
    const mockClient = {
      post: vi.fn().mockRejectedValue(new Error('Failed to create dashboard')),
    } as unknown as MetabaseClient;

    await expect(createDashboardDefinition.handler(mockClient, baseDashboardInput)).rejects.toThrow(
      'Failed to create dashboard',
    );
  });

  it('should propagate API errors with status codes', async () => {
    const apiError = new Error('Bad Request');
    (apiError as Error & { status?: number }).status = 400;

    const mockClient = {
      post: vi.fn().mockRejectedValue(apiError),
    } as unknown as MetabaseClient;

    await expect(createDashboardDefinition.handler(mockClient, baseDashboardInput)).rejects.toThrow(
      'Bad Request',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(createDashboardDefinition.name).toBe('create_dashboard');
    expect(createDashboardDefinition.description).toBe('Create a new dashboard in Metabase');
    expect(createDashboardDefinition.inputSchema).toEqual(CreateDashboardInputSchema);
  });
});
