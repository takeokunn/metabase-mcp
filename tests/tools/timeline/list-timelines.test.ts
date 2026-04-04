import { ListTimelinesParamsSchema } from '@src/schemas/timeline';
import { listTimelinesDefinition } from '@src/tools/timeline/list-timelines';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('listTimelines tool', () => {
  it('should return formatted MCP response with timelines', async () => {
    const mockTimelines = [
      { id: 1, name: 'Q4 Events', collection_id: 1 },
      { id: 2, name: 'Product Launches', collection_id: 2 },
    ];
    const mockClient = createMockClientWithResponse('get', mockTimelines);
    const result = await listTimelinesDefinition.handler(mockClient, {});
    expectMcpContent(result, mockTimelines);
    expect(mockClient.get).toHaveBeenCalledWith('/api/timeline', {
      include: undefined,
      archived: undefined,
    });
  });

  it('should pass include and archived params', async () => {
    const mockClient = createMockClientWithResponse('get', []);
    await listTimelinesDefinition.handler(mockClient, { include: 'events', archived: true });
    expect(mockClient.get).toHaveBeenCalledWith('/api/timeline', {
      include: 'events',
      archived: true,
    });
  });

  it('should handle empty timeline list', async () => {
    const mockClient = createMockClientWithResponse('get', []);
    const result = await listTimelinesDefinition.handler(mockClient, {});
    expectMcpContent(result, []);
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'API error');
    await expect(listTimelinesDefinition.handler(mockClient, {})).rejects.toThrow('API error');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Unauthorized', 401));
    await expect(listTimelinesDefinition.handler(mockClient, {})).rejects.toThrow('Unauthorized');
  });

  it('should have correct tool definition metadata', () => {
    expect(listTimelinesDefinition.name).toBe('list_timelines');
    expect(listTimelinesDefinition.inputSchema).toEqual(ListTimelinesParamsSchema);
  });
});
