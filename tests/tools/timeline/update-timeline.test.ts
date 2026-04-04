import { UpdateTimelineInputSchema } from '@src/schemas/timeline';
import { updateTimelineDefinition } from '@src/tools/timeline/update-timeline';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('updateTimeline tool', () => {
  const input = { id: 1, name: 'Updated Timeline' };

  it('should return formatted MCP response', async () => {
    const mockResult = { id: 1, name: 'Updated Timeline', collection_id: 1 };
    const mockClient = createMockClientWithResponse('put', mockResult);
    const result = await updateTimelineDefinition.handler(mockClient, input);
    expectMcpContent(result, mockResult);
    expect(mockClient.put).toHaveBeenCalledWith('/api/timeline/1', { name: 'Updated Timeline' });
  });

  it('should pass all optional fields in body without id', async () => {
    const fullInput = {
      id: 2,
      name: 'Updated',
      description: 'New description',
      icon: 'bell',
      archived: true,
      collection_id: 3,
    };
    const mockClient = createMockClientWithResponse('put', {});
    await updateTimelineDefinition.handler(mockClient, fullInput);
    expect(mockClient.put).toHaveBeenCalledWith('/api/timeline/2', {
      name: 'Updated',
      description: 'New description',
      icon: 'bell',
      archived: true,
      collection_id: 3,
    });
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('put', 'API error');
    await expect(updateTimelineDefinition.handler(mockClient, input)).rejects.toThrow('API error');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('put', createApiError('Not Found', 404));
    await expect(updateTimelineDefinition.handler(mockClient, input)).rejects.toThrow('Not Found');
  });

  it('should have correct tool definition metadata', () => {
    expect(updateTimelineDefinition.name).toBe('update_timeline');
    expect(updateTimelineDefinition.inputSchema).toEqual(UpdateTimelineInputSchema);
  });
});
