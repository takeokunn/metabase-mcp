import { getRootCollectionDefinition } from '@src/tools/collection/get-root-collection';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('getRootCollection tool', () => {
  it('should return formatted MCP response with root collection data', async () => {
    const mockCollection = {
      id: 'root',
      name: 'Our analytics',
      description: null,
      location: '/',
      personal_owner_id: null,
    };

    const mockClient = createMockClientWithResponse('get', mockCollection);

    const result = await getRootCollectionDefinition.handler(mockClient, {});

    expectMcpContent(result, mockCollection);
    expect(mockClient.get).toHaveBeenCalledWith('/api/collection/root');
    expect(mockClient.get).toHaveBeenCalledOnce();
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'Not found');

    await expect(getRootCollectionDefinition.handler(mockClient, {})).rejects.toThrow('Not found');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Unauthorized', 401));

    await expect(getRootCollectionDefinition.handler(mockClient, {})).rejects.toThrow(
      'Unauthorized',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(getRootCollectionDefinition.name).toBe('get_root_collection');
    expect(getRootCollectionDefinition.description).toBe('Get the root collection from Metabase');
  });
});
