import { CreateDashboardInputSchema } from '@src/schemas/dashboard';
import { createDashboardDefinition } from '@src/tools/dashboard/create-dashboard';
import { describe, expect, it } from 'vitest';

import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

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

    const mockClient = createMockClientWithResponse('post', mockCreatedDashboard);

    const result = await createDashboardDefinition.handler(mockClient, baseDashboardInput);

    expectMcpContent(result, mockCreatedDashboard);
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

    const mockClient = createMockClientWithResponse('post', mockCreatedDashboard);

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

    const mockClient = createMockClientWithResponse('post', mockCreatedDashboard);

    const result = await createDashboardDefinition.handler(mockClient, inputWithCollection);

    expectMcpContent(result, mockCreatedDashboard);
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

    const mockClient = createMockClientWithResponse('post', mockCreatedDashboard);

    const result = await createDashboardDefinition.handler(mockClient, inputWithParameters);

    expectMcpContent(result, mockCreatedDashboard);
    expect(mockClient.post).toHaveBeenCalledWith('/api/dashboard', {
      name: 'New Analytics Dashboard',
      description: undefined,
      collection_id: undefined,
      parameters: inputWithParameters.parameters,
    });
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('post', 'Failed to create dashboard');

    await expect(createDashboardDefinition.handler(mockClient, baseDashboardInput)).rejects.toThrow(
      'Failed to create dashboard',
    );
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('post', createApiError('Bad Request', 400));

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
