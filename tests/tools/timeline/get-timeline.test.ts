import { GetTimelineParamsSchema } from '@src/schemas/timeline';
import { getTimelineDefinition } from '@src/tools/timeline/get-timeline';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('getTimeline tool', () => {
  const input = { id: 1 };

  it('should return formatted MCP response', async () => {
    const mockResult = { id: 1, name: 'Q4 Events', collection_id: 1 };
    const mockClient = createMockClientWithResponse('get', mockResult);
    const result = await getTimelineDefinition.handler(mockClient, input);
    expectMcpContent(result, mockResult);
    expect(mockClient.get).toHaveBeenCalledWith('/api/timeline/1', {
      include: undefined,
      start: undefined,
      end: undefined,
    });
  });

  it('should pass optional query params', async () => {
    const mockClient = createMockClientWithResponse('get', {});
    await getTimelineDefinition.handler(mockClient, {
      id: 1,
      include: 'events',
      start: '2024-01-01',
      end: '2024-12-31',
    });
    expect(mockClient.get).toHaveBeenCalledWith('/api/timeline/1', {
      include: 'events',
      start: '2024-01-01',
      end: '2024-12-31',
    });
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'API error');
    await expect(getTimelineDefinition.handler(mockClient, input)).rejects.toThrow('API error');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Not Found', 404));
    await expect(getTimelineDefinition.handler(mockClient, input)).rejects.toThrow('Not Found');
  });

  it('should have correct tool definition metadata', () => {
    expect(getTimelineDefinition.name).toBe('get_timeline');
    expect(getTimelineDefinition.inputSchema).toEqual(GetTimelineParamsSchema);
  });
});
