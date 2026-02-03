import { CreateSegmentInputSchema } from '@src/schemas/segment';
import { createSegmentDefinition } from '@src/tools/segment/create-segment';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('createSegment tool', () => {
  const baseSegmentInput = {
    name: 'Active Users',
    table_id: 5,
    definition: { filter: ['>', ['field', 10, null], 0] },
  };

  it('should return formatted MCP response with created segment', async () => {
    const mockCreatedSegment = {
      id: 1,
      name: 'Active Users',
      table_id: 5,
      definition: { filter: ['>', ['field', 10, null], 0] },
      archived: false,
      creator_id: 1,
      created_at: '2024-01-15T10:00:00Z',
      updated_at: '2024-01-15T10:00:00Z',
    };

    const mockClient = createMockClientWithResponse('post', mockCreatedSegment);

    const result = await createSegmentDefinition.handler(mockClient, baseSegmentInput);

    expectMcpContent(result, mockCreatedSegment);
    expect(mockClient.post).toHaveBeenCalledWith('/api/segment', {
      name: 'Active Users',
      table_id: 5,
      definition: { filter: ['>', ['field', 10, null], 0] },
      description: undefined,
    });
    expect(mockClient.post).toHaveBeenCalledOnce();
  });

  it('should include description when provided', async () => {
    const inputWithDescription = {
      ...baseSegmentInput,
      description: 'Users who logged in within the last 30 days',
    };

    const mockCreatedSegment = {
      id: 2,
      name: 'Active Users',
      description: 'Users who logged in within the last 30 days',
      table_id: 5,
      definition: { filter: ['>', ['field', 10, null], 0] },
      archived: false,
      creator_id: 1,
    };

    const mockClient = createMockClientWithResponse('post', mockCreatedSegment);

    const result = await createSegmentDefinition.handler(mockClient, inputWithDescription);

    expectMcpContent(result, mockCreatedSegment);
    expect(mockClient.post).toHaveBeenCalledWith('/api/segment', {
      name: 'Active Users',
      table_id: 5,
      definition: { filter: ['>', ['field', 10, null], 0] },
      description: 'Users who logged in within the last 30 days',
    });
  });

  it('should handle complex MBQL definition', async () => {
    const complexInput = {
      name: 'Premium Active Users',
      table_id: 3,
      definition: {
        filter: [
          'and',
          ['=', ['field', 8, null], 'premium'],
          ['>', ['field', 12, null], '2024-01-01'],
        ],
      },
    };

    const mockCreatedSegment = {
      id: 3,
      name: 'Premium Active Users',
      table_id: 3,
      definition: complexInput.definition,
      archived: false,
    };

    const mockClient = createMockClientWithResponse('post', mockCreatedSegment);

    const result = await createSegmentDefinition.handler(mockClient, complexInput);

    expectMcpContent(result, mockCreatedSegment);
    expect(mockClient.post).toHaveBeenCalledWith('/api/segment', {
      name: 'Premium Active Users',
      table_id: 3,
      definition: complexInput.definition,
      description: undefined,
    });
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('post', 'Failed to create segment');

    await expect(createSegmentDefinition.handler(mockClient, baseSegmentInput)).rejects.toThrow(
      'Failed to create segment',
    );
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('post', createApiError('Bad Request', 400));

    await expect(createSegmentDefinition.handler(mockClient, baseSegmentInput)).rejects.toThrow(
      'Bad Request',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(createSegmentDefinition.name).toBe('create_segment');
    expect(createSegmentDefinition.description).toBe('Create a new segment in Metabase');
    expect(createSegmentDefinition.inputSchema).toEqual(CreateSegmentInputSchema);
  });
});
