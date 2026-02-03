import { UpdateSegmentInputSchema } from '@src/schemas/segment';
import { updateSegmentDefinition } from '@src/tools/segment/update-segment';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('updateSegment tool', () => {
  it('should return formatted MCP response with updated segment', async () => {
    const mockUpdatedSegment = {
      id: 1,
      name: 'Updated Active Users',
      description: 'Users who logged in within the last 30 days',
      table_id: 5,
      definition: { filter: ['>', ['field', 10, null], 0] },
      archived: false,
    };

    const mockClient = createMockClientWithResponse('put', mockUpdatedSegment);

    const result = await updateSegmentDefinition.handler(mockClient, {
      id: 1,
      revision_message: 'Updated segment name',
      name: 'Updated Active Users',
    });

    expectMcpContent(result, mockUpdatedSegment);
    expect(mockClient.put).toHaveBeenCalledWith('/api/segment/1', {
      revision_message: 'Updated segment name',
      name: 'Updated Active Users',
    });
    expect(mockClient.put).toHaveBeenCalledOnce();
  });

  it('should update segment definition', async () => {
    const newDefinition = { filter: ['>', ['field', 10, null], 100] };

    const mockUpdatedSegment = {
      id: 2,
      name: 'Active Users',
      table_id: 5,
      definition: newDefinition,
      archived: false,
    };

    const mockClient = createMockClientWithResponse('put', mockUpdatedSegment);

    const result = await updateSegmentDefinition.handler(mockClient, {
      id: 2,
      revision_message: 'Changed threshold to 100',
      definition: newDefinition,
    });

    expectMcpContent(result, mockUpdatedSegment);
    expect(mockClient.put).toHaveBeenCalledWith('/api/segment/2', {
      revision_message: 'Changed threshold to 100',
      definition: newDefinition,
    });
  });

  it('should archive segment', async () => {
    const mockUpdatedSegment = {
      id: 3,
      name: 'Deprecated Segment',
      table_id: 1,
      definition: {},
      archived: true,
    };

    const mockClient = createMockClientWithResponse('put', mockUpdatedSegment);

    const result = await updateSegmentDefinition.handler(mockClient, {
      id: 3,
      revision_message: 'Archiving deprecated segment',
      archived: true,
    });

    expectMcpContent(result, mockUpdatedSegment);
    expect(mockClient.put).toHaveBeenCalledWith('/api/segment/3', {
      revision_message: 'Archiving deprecated segment',
      archived: true,
    });
  });

  it('should update multiple fields at once', async () => {
    const mockUpdatedSegment = {
      id: 4,
      name: 'Comprehensive Update',
      table_id: 5,
      definition: { filter: ['=', ['field', 1, null], 'active'] },
      archived: false,
    };

    const mockClient = createMockClientWithResponse('put', mockUpdatedSegment);

    const result = await updateSegmentDefinition.handler(mockClient, {
      id: 4,
      revision_message: 'Major update to segment',
      name: 'Comprehensive Update',
      definition: { filter: ['=', ['field', 1, null], 'active'] },
    });

    expectMcpContent(result, mockUpdatedSegment);
    expect(mockClient.put).toHaveBeenCalledWith('/api/segment/4', {
      revision_message: 'Major update to segment',
      name: 'Comprehensive Update',
      definition: { filter: ['=', ['field', 1, null], 'active'] },
    });
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('put', 'Segment not found');

    await expect(
      updateSegmentDefinition.handler(mockClient, {
        id: 999,
        revision_message: 'Test update',
        name: 'Test',
      }),
    ).rejects.toThrow('Segment not found');
    expect(mockClient.put).toHaveBeenCalledWith('/api/segment/999', {
      revision_message: 'Test update',
      name: 'Test',
    });
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('put', createApiError('Bad Request', 400));

    await expect(
      updateSegmentDefinition.handler(mockClient, {
        id: 1,
        revision_message: 'Test',
        name: 'Test',
      }),
    ).rejects.toThrow('Bad Request');
  });

  it('should propagate forbidden errors', async () => {
    const mockClient = createMockClientWithError('put', createApiError('Forbidden', 403));

    await expect(
      updateSegmentDefinition.handler(mockClient, {
        id: 1,
        revision_message: 'Test',
        name: 'Test',
      }),
    ).rejects.toThrow('Forbidden');
  });

  it('should have correct tool definition metadata', () => {
    expect(updateSegmentDefinition.name).toBe('update_segment');
    expect(updateSegmentDefinition.description).toBe('Update an existing segment in Metabase');
    expect(updateSegmentDefinition.inputSchema).toEqual(UpdateSegmentInputSchema);
  });
});
