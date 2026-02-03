import { ListSegmentsParamsSchema } from '@src/schemas/segment';
import { listSegmentsDefinition } from '@src/tools/segment/list-segments';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('listSegments tool', () => {
  it('should return formatted MCP response with segments', async () => {
    const mockSegments = [
      {
        id: 1,
        name: 'Active Users',
        description: 'Users who logged in within the last 30 days',
        table_id: 5,
        definition: { filter: ['>', ['field', 10, null], 0] },
        archived: false,
        creator_id: 1,
        created_at: '2024-01-15T10:00:00Z',
        updated_at: '2024-01-20T15:30:00Z',
      },
      {
        id: 2,
        name: 'Premium Customers',
        description: 'Customers with premium subscription',
        table_id: 3,
        definition: { filter: ['=', ['field', 8, null], 'premium'] },
        archived: false,
        creator_id: 2,
        created_at: '2024-02-01T09:00:00Z',
        updated_at: '2024-02-10T12:00:00Z',
      },
    ];

    const mockClient = createMockClientWithResponse('get', mockSegments);

    const result = await listSegmentsDefinition.handler(mockClient, {});

    expectMcpContent(result, mockSegments);
    expect(mockClient.get).toHaveBeenCalledWith('/api/segment');
    expect(mockClient.get).toHaveBeenCalledOnce();
  });

  it('should handle segments with minimal data', async () => {
    const mockSegments = [
      {
        id: 1,
        name: 'Simple Segment',
        table_id: 1,
        definition: {},
        archived: false,
      },
    ];

    const mockClient = createMockClientWithResponse('get', mockSegments);

    const result = await listSegmentsDefinition.handler(mockClient, {});

    expectMcpContent(result, mockSegments);
  });

  it('should handle empty segment list', async () => {
    const mockClient = createMockClientWithResponse('get', []);

    const result = await listSegmentsDefinition.handler(mockClient, {});

    expectMcpContent(result, []);
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'API error');

    await expect(listSegmentsDefinition.handler(mockClient, {})).rejects.toThrow('API error');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Unauthorized', 401));

    await expect(listSegmentsDefinition.handler(mockClient, {})).rejects.toThrow('Unauthorized');
  });

  it('should have correct tool definition metadata', () => {
    expect(listSegmentsDefinition.name).toBe('list_segments');
    expect(listSegmentsDefinition.description).toBe('Get list of all segments in Metabase');
    expect(listSegmentsDefinition.inputSchema).toEqual(ListSegmentsParamsSchema);
  });
});
