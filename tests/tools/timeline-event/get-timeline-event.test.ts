import { GetTimelineEventParamsSchema } from '@src/schemas/timeline';
import { getTimelineEventDefinition } from '@src/tools/timeline-event/get-timeline-event';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('getTimelineEvent tool', () => {
  const input = { id: 1 };

  it('should return formatted MCP response', async () => {
    const mockResult = {
      id: 1,
      name: 'Product Launch',
      timeline_id: 1,
      timestamp: '2024-06-01T00:00:00Z',
    };
    const mockClient = createMockClientWithResponse('get', mockResult);
    const result = await getTimelineEventDefinition.handler(mockClient, input);
    expectMcpContent(result, mockResult);
    expect(mockClient.get).toHaveBeenCalledWith('/api/timeline-event/1');
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'API error');
    await expect(getTimelineEventDefinition.handler(mockClient, input)).rejects.toThrow(
      'API error',
    );
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Not Found', 404));
    await expect(getTimelineEventDefinition.handler(mockClient, input)).rejects.toThrow(
      'Not Found',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(getTimelineEventDefinition.name).toBe('get_timeline_event');
    expect(getTimelineEventDefinition.inputSchema).toEqual(GetTimelineEventParamsSchema);
  });
});
