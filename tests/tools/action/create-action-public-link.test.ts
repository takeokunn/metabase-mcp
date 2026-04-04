import { CreateActionPublicLinkParamsSchema } from '@src/schemas/action';
import { createActionPublicLinkDefinition } from '@src/tools/action/create-action-public-link';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('createActionPublicLink tool', () => {
  it('should return formatted MCP response with public link UUID', async () => {
    const mockResult = { uuid: 'abc123-def456-ghi789' };
    const mockClient = createMockClientWithResponse('post', mockResult);

    const result = await createActionPublicLinkDefinition.handler(mockClient, { id: 1 });

    expectMcpContent(result, mockResult);
    expect(mockClient.post).toHaveBeenCalledWith('/api/action/1/public_link', {});
    expect(mockClient.post).toHaveBeenCalledOnce();
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('post', 'API error');
    await expect(createActionPublicLinkDefinition.handler(mockClient, { id: 1 })).rejects.toThrow(
      'API error',
    );
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('post', createApiError('Forbidden', 403));
    await expect(createActionPublicLinkDefinition.handler(mockClient, { id: 1 })).rejects.toThrow(
      'Forbidden',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(createActionPublicLinkDefinition.name).toBe('create_action_public_link');
    expect(createActionPublicLinkDefinition.inputSchema).toEqual(
      CreateActionPublicLinkParamsSchema,
    );
  });
});
