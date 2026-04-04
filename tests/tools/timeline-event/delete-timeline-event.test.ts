import { DeleteTimelineEventParamsSchema } from '@src/schemas/timeline';
import { deleteTimelineEventDefinition } from '@src/tools/timeline-event/delete-timeline-event';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('deleteTimelineEvent tool', () => {
  const input = { id: 1 };

  it('should return formatted MCP response', async () => {
    const mockResult = null;
    const mockClient = createMockClientWithResponse('delete', mockResult);
    const result = await deleteTimelineEventDefinition.handler(mockClient, input);
    expectMcpContent(result, mockResult);
    expect(mockClient.delete).toHaveBeenCalledWith('/api/timeline-event/1');
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('delete', 'API error');
    await expect(deleteTimelineEventDefinition.handler(mockClient, input)).rejects.toThrow('API error');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('delete', createApiError('Not Found', 404));
    await expect(deleteTimelineEventDefinition.handler(mockClient, input)).rejects.toThrow('Not Found');
  });

  it('should have correct tool definition metadata', () => {
    expect(deleteTimelineEventDefinition.name).toBe('delete_timeline_event');
    expect(deleteTimelineEventDefinition.inputSchema).toEqual(DeleteTimelineEventParamsSchema);
  });
});
