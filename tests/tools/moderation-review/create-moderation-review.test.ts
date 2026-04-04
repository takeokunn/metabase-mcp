import { createModerationReviewDefinition } from '@src/tools/moderation-review/create-moderation-review';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('createModerationReview tool', () => {
  const input = {
    moderated_item_id: 42,
    moderated_item_type: 'card',
    status: 'verified',
    text: 'This card has been reviewed',
  };

  it('should return formatted MCP response', async () => {
    const mockResult = { id: 1, moderated_item_id: 42, status: 'verified' };
    const mockClient = createMockClientWithResponse('post', mockResult);
    const result = await createModerationReviewDefinition.handler(mockClient, input);
    expectMcpContent(result, mockResult);
  });

  it('should call correct endpoint with review data', async () => {
    const mockClient = createMockClientWithResponse('post', {});
    await createModerationReviewDefinition.handler(mockClient, input);
    expect(mockClient.post).toHaveBeenCalledWith('/api/moderation-review', {
      moderated_item_id: 42,
      moderated_item_type: 'card',
      status: 'verified',
      text: 'This card has been reviewed',
    });
  });

  it('should handle null status and text', async () => {
    const inputWithNulls = { ...input, status: null, text: null };
    const mockClient = createMockClientWithResponse('post', {});
    await createModerationReviewDefinition.handler(mockClient, inputWithNulls);
    expect(mockClient.post).toHaveBeenCalledWith('/api/moderation-review', {
      moderated_item_id: 42,
      moderated_item_type: 'card',
      status: null,
      text: null,
    });
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('post', 'API error');
    await expect(createModerationReviewDefinition.handler(mockClient, input)).rejects.toThrow('API error');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('post', createApiError('Forbidden', 403));
    await expect(createModerationReviewDefinition.handler(mockClient, input)).rejects.toThrow('Forbidden');
  });
});
