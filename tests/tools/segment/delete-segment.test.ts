import { DeleteSegmentInputSchema } from '@src/schemas/segment';
import { deleteSegmentDefinition } from '@src/tools/segment/delete-segment';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('deleteSegment tool', () => {
  it('should return formatted MCP response after deleting segment', async () => {
    const mockResult = { success: true };

    const mockClient = createMockClientWithResponse('delete', mockResult);

    const result = await deleteSegmentDefinition.handler(mockClient, { id: 1 });

    expectMcpContent(result, mockResult);
    expect(mockClient.delete).toHaveBeenCalledWith('/api/segment/1', undefined);
    expect(mockClient.delete).toHaveBeenCalledOnce();
  });

  it('should delete segment with revision message', async () => {
    const mockResult = { success: true };

    const mockClient = createMockClientWithResponse('delete', mockResult);

    const result = await deleteSegmentDefinition.handler(mockClient, {
      id: 2,
      revision_message: 'Removing obsolete segment',
    });

    expectMcpContent(result, mockResult);
    expect(mockClient.delete).toHaveBeenCalledWith('/api/segment/2', {
      revision_message: 'Removing obsolete segment',
    });
  });

  it('should delete segment with different ID', async () => {
    const mockResult = { success: true };

    const mockClient = createMockClientWithResponse('delete', mockResult);

    const result = await deleteSegmentDefinition.handler(mockClient, { id: 42 });

    expectMcpContent(result, mockResult);
    expect(mockClient.delete).toHaveBeenCalledWith('/api/segment/42', undefined);
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('delete', 'Segment not found');

    await expect(deleteSegmentDefinition.handler(mockClient, { id: 999 })).rejects.toThrow(
      'Segment not found',
    );
    expect(mockClient.delete).toHaveBeenCalledWith('/api/segment/999', undefined);
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('delete', createApiError('Forbidden', 403));

    await expect(deleteSegmentDefinition.handler(mockClient, { id: 1 })).rejects.toThrow(
      'Forbidden',
    );
  });

  it('should propagate unauthorized errors', async () => {
    const mockClient = createMockClientWithError('delete', createApiError('Unauthorized', 401));

    await expect(deleteSegmentDefinition.handler(mockClient, { id: 1 })).rejects.toThrow(
      'Unauthorized',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(deleteSegmentDefinition.name).toBe('delete_segment');
    expect(deleteSegmentDefinition.description).toBe('Delete a segment from Metabase');
    expect(deleteSegmentDefinition.inputSchema).toEqual(DeleteSegmentInputSchema);
  });
});
