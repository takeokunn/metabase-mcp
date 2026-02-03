import { CreatePermissionGroupInputSchema } from '@src/schemas/permissions';
import { createPermissionGroupDefinition } from '@src/tools/permissions/create-permission-group';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('createPermissionGroup tool', () => {
  it('should create a permission group and return formatted MCP response', async () => {
    const mockResponse = {
      id: 4,
      name: 'Data Analysts',
    };

    const mockClient = createMockClientWithResponse('post', mockResponse);

    const input = { name: 'Data Analysts' };

    const result = await createPermissionGroupDefinition.handler(mockClient, input);

    expectMcpContent(result, mockResponse);
    expect(mockClient.post).toHaveBeenCalledWith('/api/permissions/group', {
      name: 'Data Analysts',
    });
    expect(mockClient.post).toHaveBeenCalledOnce();
  });

  it('should handle group with special characters in name', async () => {
    const mockResponse = {
      id: 5,
      name: 'Sales & Marketing Team',
    };

    const mockClient = createMockClientWithResponse('post', mockResponse);

    const input = { name: 'Sales & Marketing Team' };

    const result = await createPermissionGroupDefinition.handler(mockClient, input);

    expectMcpContent(result, mockResponse);
    expect(mockClient.post).toHaveBeenCalledWith('/api/permissions/group', {
      name: 'Sales & Marketing Team',
    });
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('post', 'Group name already exists');

    const input = { name: 'Existing Group' };

    await expect(createPermissionGroupDefinition.handler(mockClient, input)).rejects.toThrow(
      'Group name already exists',
    );
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('post', createApiError('Forbidden', 403));

    const input = { name: 'New Group' };

    await expect(createPermissionGroupDefinition.handler(mockClient, input)).rejects.toThrow(
      'Forbidden',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(createPermissionGroupDefinition.name).toBe('create_permission_group');
    expect(createPermissionGroupDefinition.description).toBe(
      'Create a new permission group in Metabase',
    );
    expect(createPermissionGroupDefinition.inputSchema).toEqual(CreatePermissionGroupInputSchema);
  });
});
