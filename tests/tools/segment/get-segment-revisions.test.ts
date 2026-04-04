import { GetSegmentRevisionsParamsSchema } from '@src/schemas/segment';
import { getSegmentRevisionsDefinition } from '@src/tools/segment/get-segment-revisions';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('getSegmentRevisions tool', () => {
  it('should return formatted MCP response with segment revisions', async () => {
    const mockRevisions = [
      {
        id: 3,
        is_reversion: false,
        is_creation: false,
        message: 'Updated filter definition',
        user: {
          id: 1,
          email: 'admin@example.com',
          first_name: 'Admin',
          last_name: 'User',
        },
        timestamp: '2024-02-15T14:30:00Z',
        diff: {
          before: { definition: { filter: ['>', ['field', 10, null], 0] } },
          after: { definition: { filter: ['>', ['field', 10, null], 100] } },
        },
      },
      {
        id: 2,
        is_reversion: false,
        is_creation: false,
        message: 'Changed segment name',
        user: {
          id: 2,
          email: 'user@example.com',
          first_name: 'Regular',
          last_name: 'User',
        },
        timestamp: '2024-02-10T10:00:00Z',
        diff: {
          before: { name: 'Old Name' },
          after: { name: 'Active Users' },
        },
      },
      {
        id: 1,
        is_reversion: false,
        is_creation: true,
        message: null,
        user: {
          id: 1,
          email: 'admin@example.com',
          first_name: 'Admin',
          last_name: 'User',
        },
        timestamp: '2024-01-15T10:00:00Z',
        diff: null,
      },
    ];

    const mockClient = createMockClientWithResponse('get', mockRevisions);

    const result = await getSegmentRevisionsDefinition.handler(mockClient, { id: 1 });

    expectMcpContent(result, mockRevisions);
    expect(mockClient.get).toHaveBeenCalledWith('/api/revision', { entity: 'segment', id: 1 });
    expect(mockClient.get).toHaveBeenCalledOnce();
  });

  it('should handle segment with minimal revisions (creation only)', async () => {
    const mockRevisions = [
      {
        id: 1,
        is_reversion: false,
        is_creation: true,
        message: null,
        user: {
          id: 1,
          email: 'admin@example.com',
          first_name: 'Admin',
          last_name: 'User',
        },
        timestamp: '2024-01-01T00:00:00Z',
      },
    ];

    const mockClient = createMockClientWithResponse('get', mockRevisions);

    const result = await getSegmentRevisionsDefinition.handler(mockClient, { id: 42 });

    expectMcpContent(result, mockRevisions);
    expect(mockClient.get).toHaveBeenCalledWith('/api/revision', { entity: 'segment', id: 42 });
  });

  it('should handle empty revisions', async () => {
    const mockClient = createMockClientWithResponse('get', []);

    const result = await getSegmentRevisionsDefinition.handler(mockClient, { id: 5 });

    expectMcpContent(result, []);
    expect(mockClient.get).toHaveBeenCalledWith('/api/revision', { entity: 'segment', id: 5 });
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'Segment not found');

    await expect(getSegmentRevisionsDefinition.handler(mockClient, { id: 999 })).rejects.toThrow(
      'Segment not found',
    );
    expect(mockClient.get).toHaveBeenCalledWith('/api/revision', { entity: 'segment', id: 999 });
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Unauthorized', 401));

    await expect(getSegmentRevisionsDefinition.handler(mockClient, { id: 1 })).rejects.toThrow(
      'Unauthorized',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(getSegmentRevisionsDefinition.name).toBe('get_segment_revisions');
    expect(getSegmentRevisionsDefinition.description).toBe(
      'Get revision history of a segment from Metabase',
    );
    expect(getSegmentRevisionsDefinition.inputSchema).toEqual(GetSegmentRevisionsParamsSchema);
  });
});
