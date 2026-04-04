import { GetCollectionTimelinesParamsSchema } from '@src/schemas/timeline';
import { getCollectionTimelinesDefinition } from '@src/tools/timeline/get-collection-timelines';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('getCollectionTimelines tool', () => {
  const input = { id: 5 };

  it('should return formatted MCP response', async () => {
    const mockTimelines = [{ id: 1, name: 'Collection Timeline', collection_id: 5 }];
    const mockClient = createMockClientWithResponse('get', mockTimelines);
    const result = await getCollectionTimelinesDefinition.handler(mockClient, input);
    expectMcpContent(result, mockTimelines);
    expect(mockClient.get).toHaveBeenCalledWith('/api/timeline/collection/5', {
      include: undefined,
      archived: undefined,
    });
  });

  it('should pass optional query params', async () => {
    const mockClient = createMockClientWithResponse('get', []);
    await getCollectionTimelinesDefinition.handler(mockClient, { id: 5, include: 'events', archived: true });
    expect(mockClient.get).toHaveBeenCalledWith('/api/timeline/collection/5', {
      include: 'events',
      archived: true,
    });
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'API error');
    await expect(getCollectionTimelinesDefinition.handler(mockClient, input)).rejects.toThrow('API error');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Not Found', 404));
    await expect(getCollectionTimelinesDefinition.handler(mockClient, input)).rejects.toThrow('Not Found');
  });

  it('should have correct tool definition metadata', () => {
    expect(getCollectionTimelinesDefinition.name).toBe('get_collection_timelines');
    expect(getCollectionTimelinesDefinition.inputSchema).toEqual(GetCollectionTimelinesParamsSchema);
  });
});
