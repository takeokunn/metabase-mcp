import { DeleteActionPublicLinkParamsSchema } from '@src/schemas/action';
import { deleteActionPublicLinkDefinition } from '@src/tools/action/delete-action-public-link';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('deleteActionPublicLink tool', () => {
  it('should return formatted MCP response on successful deletion', async () => {
    const mockResult = null;
    const mockClient = createMockClientWithResponse('delete', mockResult);

    const result = await deleteActionPublicLinkDefinition.handler(mockClient, { id: 1 });

    expectMcpContent(result, mockResult);
    expect(mockClient.delete).toHaveBeenCalledWith('/api/action/1/public_link');
    expect(mockClient.delete).toHaveBeenCalledOnce();
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('delete', 'API error');
    await expect(deleteActionPublicLinkDefinition.handler(mockClient, { id: 1 })).rejects.toThrow(
      'API error',
    );
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('delete', createApiError('Not found', 404));
    await expect(deleteActionPublicLinkDefinition.handler(mockClient, { id: 999 })).rejects.toThrow(
      'Not found',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(deleteActionPublicLinkDefinition.name).toBe('delete_action_public_link');
    expect(deleteActionPublicLinkDefinition.inputSchema).toEqual(
      DeleteActionPublicLinkParamsSchema,
    );
  });
});
