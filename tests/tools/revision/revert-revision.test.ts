import { RevertRevisionInputSchema } from '@src/schemas/revision';
import { revertRevisionDefinition } from '@src/tools/revision/revert-revision';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('revertRevision tool', () => {
  it('should revert to a revision and return formatted MCP response', async () => {
    const mockResult = { success: true };
    const mockClient = createMockClientWithResponse('post', mockResult);

    const result = await revertRevisionDefinition.handler(mockClient, {
      entity: 'dashboard',
      id: 5,
      revision_id: 3,
    });

    expectMcpContent(result, mockResult);
    expect(mockClient.post).toHaveBeenCalledWith('/api/revision/revert', {
      entity: 'dashboard',
      id: 5,
      revision_id: 3,
    });
    expect(mockClient.post).toHaveBeenCalledOnce();
  });

  it('should revert a card revision', async () => {
    const mockClient = createMockClientWithResponse('post', { success: true });

    await revertRevisionDefinition.handler(mockClient, {
      entity: 'card',
      id: 10,
      revision_id: 7,
    });

    expect(mockClient.post).toHaveBeenCalledWith('/api/revision/revert', {
      entity: 'card',
      id: 10,
      revision_id: 7,
    });
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('post', 'API error');

    await expect(
      revertRevisionDefinition.handler(mockClient, { entity: 'dashboard', id: 1, revision_id: 1 }),
    ).rejects.toThrow('API error');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('post', createApiError('Not found', 404));

    await expect(
      revertRevisionDefinition.handler(mockClient, { entity: 'dashboard', id: 1, revision_id: 1 }),
    ).rejects.toThrow('Not found');
  });

  it('should have correct tool definition metadata', () => {
    expect(revertRevisionDefinition.name).toBe('revert_revision');
    expect(revertRevisionDefinition.inputSchema).toEqual(RevertRevisionInputSchema);
  });
});
