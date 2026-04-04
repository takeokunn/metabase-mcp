import { DeleteTimelineParamsSchema } from '@src/schemas/timeline';
import { deleteTimelineDefinition } from '@src/tools/timeline/delete-timeline';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('deleteTimeline tool', () => {
  const input = { id: 1 };

  it('should return formatted MCP response', async () => {
    const mockResult = null;
    const mockClient = createMockClientWithResponse('delete', mockResult);
    const result = await deleteTimelineDefinition.handler(mockClient, input);
    expectMcpContent(result, mockResult);
    expect(mockClient.delete).toHaveBeenCalledWith('/api/timeline/1');
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('delete', 'API error');
    await expect(deleteTimelineDefinition.handler(mockClient, input)).rejects.toThrow('API error');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('delete', createApiError('Not Found', 404));
    await expect(deleteTimelineDefinition.handler(mockClient, input)).rejects.toThrow('Not Found');
  });

  it('should have correct tool definition metadata', () => {
    expect(deleteTimelineDefinition.name).toBe('delete_timeline');
    expect(deleteTimelineDefinition.inputSchema).toEqual(DeleteTimelineParamsSchema);
  });
});
