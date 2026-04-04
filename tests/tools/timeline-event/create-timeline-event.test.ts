import { CreateTimelineEventInputSchema } from '@src/schemas/timeline';
import { createTimelineEventDefinition } from '@src/tools/timeline-event/create-timeline-event';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('createTimelineEvent tool', () => {
  const input = { name: 'Product Launch', timeline_id: 1, timestamp: '2024-06-01T00:00:00Z' };

  it('should return formatted MCP response', async () => {
    const mockResult = { id: 1, name: 'Product Launch', timeline_id: 1, timestamp: '2024-06-01T00:00:00Z' };
    const mockClient = createMockClientWithResponse('post', mockResult);
    const result = await createTimelineEventDefinition.handler(mockClient, input);
    expectMcpContent(result, mockResult);
    expect(mockClient.post).toHaveBeenCalledWith(
      '/api/timeline-event',
      expect.objectContaining({ name: 'Product Launch', timeline_id: 1 }),
    );
  });

  it('should pass all optional fields', async () => {
    const fullInput = {
      name: 'Product Launch',
      timeline_id: 1,
      timestamp: '2024-06-01T00:00:00Z',
      description: 'Major product release',
      icon: 'star',
      time_matters: true,
      timezone: 'US/Pacific',
      archived: false,
    };
    const mockClient = createMockClientWithResponse('post', {});
    await createTimelineEventDefinition.handler(mockClient, fullInput);
    expect(mockClient.post).toHaveBeenCalledWith('/api/timeline-event', {
      name: 'Product Launch',
      timeline_id: 1,
      timestamp: '2024-06-01T00:00:00Z',
      description: 'Major product release',
      icon: 'star',
      time_matters: true,
      timezone: 'US/Pacific',
      archived: false,
    });
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('post', 'API error');
    await expect(createTimelineEventDefinition.handler(mockClient, input)).rejects.toThrow('API error');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('post', createApiError('Bad Request', 400));
    await expect(createTimelineEventDefinition.handler(mockClient, input)).rejects.toThrow('Bad Request');
  });

  it('should have correct tool definition metadata', () => {
    expect(createTimelineEventDefinition.name).toBe('create_timeline_event');
    expect(createTimelineEventDefinition.inputSchema).toEqual(CreateTimelineEventInputSchema);
  });
});
