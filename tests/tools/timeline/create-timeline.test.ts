import { CreateTimelineInputSchema } from '@src/schemas/timeline';
import { createTimelineDefinition } from '@src/tools/timeline/create-timeline';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('createTimeline tool', () => {
  const input = { name: 'Q4 Events', collection_id: 1 };

  it('should return formatted MCP response', async () => {
    const mockResult = { id: 1, name: 'Q4 Events', collection_id: 1 };
    const mockClient = createMockClientWithResponse('post', mockResult);
    const result = await createTimelineDefinition.handler(mockClient, input);
    expectMcpContent(result, mockResult);
    expect(mockClient.post).toHaveBeenCalledWith('/api/timeline', expect.objectContaining({ name: 'Q4 Events' }));
  });

  it('should pass all optional fields', async () => {
    const fullInput = {
      name: 'Q4 Events',
      collection_id: 1,
      description: 'Quarterly events',
      icon: 'star',
      archived: false,
    };
    const mockClient = createMockClientWithResponse('post', {});
    await createTimelineDefinition.handler(mockClient, fullInput);
    expect(mockClient.post).toHaveBeenCalledWith('/api/timeline', {
      name: 'Q4 Events',
      collection_id: 1,
      description: 'Quarterly events',
      icon: 'star',
      archived: false,
    });
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('post', 'API error');
    await expect(createTimelineDefinition.handler(mockClient, input)).rejects.toThrow('API error');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('post', createApiError('Bad Request', 400));
    await expect(createTimelineDefinition.handler(mockClient, input)).rejects.toThrow('Bad Request');
  });

  it('should have correct tool definition metadata', () => {
    expect(createTimelineDefinition.name).toBe('create_timeline');
    expect(createTimelineDefinition.inputSchema).toEqual(CreateTimelineInputSchema);
  });
});
