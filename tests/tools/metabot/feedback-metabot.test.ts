import { feedbackMetabotDefinition } from '@src/tools/metabot/feedback-metabot';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('feedbackMetabot tool', () => {
  const input = { feedback_type: 'positive', conversation_id: 'conv-123' };

  it('should return formatted MCP response', async () => {
    const mockResult = { success: true };
    const mockClient = createMockClientWithResponse('post', mockResult);
    const result = await feedbackMetabotDefinition.handler(mockClient, input);
    expectMcpContent(result, mockResult);
  });

  it('should have EE annotation in description', () => {
    expect(feedbackMetabotDefinition.description).toContain('[Requires Metabase Pro]');
  });

  it('should call correct endpoint', async () => {
    const mockClient = createMockClientWithResponse('post', {});
    await feedbackMetabotDefinition.handler(mockClient, input);
    expect(mockClient.post).toHaveBeenCalledWith('/api/metabot/feedback', {
      feedback_type: input.feedback_type,
      conversation_id: input.conversation_id,
    });
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('post', 'API error');
    await expect(feedbackMetabotDefinition.handler(mockClient, input)).rejects.toThrow('API error');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('post', createApiError('Not Found', 404));
    await expect(feedbackMetabotDefinition.handler(mockClient, input)).rejects.toThrow('Not Found');
  });
});
