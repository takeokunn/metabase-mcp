import { UpdateTimelineEventInputSchema } from '@src/schemas/timeline';
import { updateTimelineEventDefinition } from '@src/tools/timeline-event/update-timeline-event';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('updateTimelineEvent tool', () => {
  const input = { id: 1, name: 'Updated Event' };

  it('should return formatted MCP response', async () => {
    const mockResult = { id: 1, name: 'Updated Event', timeline_id: 1 };
    const mockClient = createMockClientWithResponse('put', mockResult);
    const result = await updateTimelineEventDefinition.handler(mockClient, input);
    expectMcpContent(result, mockResult);
    expect(mockClient.put).toHaveBeenCalledWith('/api/timeline-event/1', { name: 'Updated Event' });
  });

  it('should pass all optional fields in body without id', async () => {
    const fullInput = {
      id: 2,
      name: 'Updated',
      description: 'New description',
      timestamp: '2024-07-01T00:00:00Z',
      icon: 'bell',
      timeline_id: 3,
      time_matters: false,
      timezone: 'US/Eastern',
      archived: true,
    };
    const mockClient = createMockClientWithResponse('put', {});
    await updateTimelineEventDefinition.handler(mockClient, fullInput);
    expect(mockClient.put).toHaveBeenCalledWith('/api/timeline-event/2', {
      name: 'Updated',
      description: 'New description',
      timestamp: '2024-07-01T00:00:00Z',
      icon: 'bell',
      timeline_id: 3,
      time_matters: false,
      timezone: 'US/Eastern',
      archived: true,
    });
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('put', 'API error');
    await expect(updateTimelineEventDefinition.handler(mockClient, input)).rejects.toThrow(
      'API error',
    );
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('put', createApiError('Not Found', 404));
    await expect(updateTimelineEventDefinition.handler(mockClient, input)).rejects.toThrow(
      'Not Found',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(updateTimelineEventDefinition.name).toBe('update_timeline_event');
    expect(updateTimelineEventDefinition.inputSchema).toEqual(UpdateTimelineEventInputSchema);
  });
});
