import { GetSegmentRelatedInputSchema } from '@src/schemas/segment';
import { getSegmentRelatedDefinition } from '@src/tools/segment/get-segment-related';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('getSegmentRelated tool', () => {
  it('should return formatted MCP response', async () => {
    const mockClient = createMockClientWithResponse('get', { id: 1 });
    const result = await getSegmentRelatedDefinition.handler(mockClient, { id: 1 });
    expectMcpContent(result, { id: 1 });
    expect(mockClient.get).toHaveBeenCalledWith('/api/segment/1/related');
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'Not found');
    await expect(getSegmentRelatedDefinition.handler(mockClient, { id: 999 })).rejects.toThrow('Not found');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Unauthorized', 401));
    await expect(getSegmentRelatedDefinition.handler(mockClient, { id: 1 })).rejects.toThrow('Unauthorized');
  });

  it('should have correct tool definition metadata', () => {
    expect(getSegmentRelatedDefinition.name).toBe('get_segment_related');
    expect(getSegmentRelatedDefinition.description).toBe('Get related items for a segment in Metabase');
    expect(getSegmentRelatedDefinition.inputSchema).toEqual(GetSegmentRelatedInputSchema);
  });
});
