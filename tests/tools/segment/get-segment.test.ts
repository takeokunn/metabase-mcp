import { GetSegmentParamsSchema } from '@src/schemas/segment';
import { getSegmentDefinition } from '@src/tools/segment/get-segment';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('getSegment tool', () => {
  it('should return formatted MCP response with segment data', async () => {
    const mockSegment = {
      id: 1,
      name: 'Active Users',
      description: 'Users who logged in within the last 30 days',
      table_id: 5,
      definition: { filter: ['>', ['field', 10, null], 0] },
      archived: false,
      creator_id: 1,
      created_at: '2024-01-15T10:00:00Z',
      updated_at: '2024-01-20T15:30:00Z',
    };

    const mockClient = createMockClientWithResponse('get', mockSegment);

    const result = await getSegmentDefinition.handler(mockClient, { id: 1 });

    expectMcpContent(result, mockSegment);
    expect(mockClient.get).toHaveBeenCalledWith('/api/segment/1');
    expect(mockClient.get).toHaveBeenCalledOnce();
  });

  it('should handle segment with minimal data', async () => {
    const mockSegment = {
      id: 42,
      name: 'Simple Segment',
      table_id: 1,
      definition: {},
      archived: false,
    };

    const mockClient = createMockClientWithResponse('get', mockSegment);

    const result = await getSegmentDefinition.handler(mockClient, { id: 42 });

    expectMcpContent(result, mockSegment);
    expect(mockClient.get).toHaveBeenCalledWith('/api/segment/42');
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'Segment not found');

    await expect(getSegmentDefinition.handler(mockClient, { id: 999 })).rejects.toThrow(
      'Segment not found',
    );
    expect(mockClient.get).toHaveBeenCalledWith('/api/segment/999');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Unauthorized', 401));

    await expect(getSegmentDefinition.handler(mockClient, { id: 1 })).rejects.toThrow(
      'Unauthorized',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(getSegmentDefinition.name).toBe('get_segment');
    expect(getSegmentDefinition.description).toBe('Get a single segment by ID from Metabase');
    expect(getSegmentDefinition.inputSchema).toEqual(GetSegmentParamsSchema);
  });
});
