import { GetCollectionRootTimelinesParamsSchema } from '@src/schemas/timeline';
import { getCollectionRootTimelinesDefinition } from '@src/tools/timeline/get-collection-root-timelines';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('getCollectionRootTimelines tool', () => {
  it('should return formatted MCP response with root timelines', async () => {
    const mockTimelines = [{ id: 1, name: 'Root Timeline', collection_id: null }];
    const mockClient = createMockClientWithResponse('get', mockTimelines);
    const result = await getCollectionRootTimelinesDefinition.handler(mockClient, {});
    expectMcpContent(result, mockTimelines);
    expect(mockClient.get).toHaveBeenCalledWith('/api/timeline/collection/root', {
      include: undefined,
      archived: undefined,
    });
  });

  it('should pass include and archived params', async () => {
    const mockClient = createMockClientWithResponse('get', []);
    await getCollectionRootTimelinesDefinition.handler(mockClient, {
      include: 'events',
      archived: false,
    });
    expect(mockClient.get).toHaveBeenCalledWith('/api/timeline/collection/root', {
      include: 'events',
      archived: false,
    });
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'API error');
    await expect(getCollectionRootTimelinesDefinition.handler(mockClient, {})).rejects.toThrow(
      'API error',
    );
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Unauthorized', 401));
    await expect(getCollectionRootTimelinesDefinition.handler(mockClient, {})).rejects.toThrow(
      'Unauthorized',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(getCollectionRootTimelinesDefinition.name).toBe('get_collection_root_timelines');
    expect(getCollectionRootTimelinesDefinition.inputSchema).toEqual(
      GetCollectionRootTimelinesParamsSchema,
    );
  });
});
