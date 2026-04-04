import { SubmitProductFeedbackInputSchema } from '@src/schemas/product-feedback';
import { submitProductFeedbackDefinition } from '@src/tools/product-feedback/submit-product-feedback';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('submitProductFeedback tool', () => {
  it('should return formatted MCP response', async () => {
    const mockResult = { success: true };
    const mockClient = createMockClientWithResponse('post', mockResult);
    const result = await submitProductFeedbackDefinition.handler(mockClient, {
      source: 'dashboard',
      comment: 'Great tool!',
    });
    expectMcpContent(result, mockResult);
    expect(mockClient.post).toHaveBeenCalledWith('/api/product-feedback', {
      source: 'dashboard',
      comment: 'Great tool!',
    });
    expect(mockClient.post).toHaveBeenCalledOnce();
  });

  it('should work without optional comment', async () => {
    const mockClient = createMockClientWithResponse('post', { success: true });
    await submitProductFeedbackDefinition.handler(mockClient, { source: 'dashboard' });
    expect(mockClient.post).toHaveBeenCalledWith('/api/product-feedback', {
      source: 'dashboard',
      comment: undefined,
    });
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('post', 'Not found');
    await expect(
      submitProductFeedbackDefinition.handler(mockClient, { source: 'dashboard' }),
    ).rejects.toThrow('Not found');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('post', createApiError('Unauthorized', 401));
    await expect(
      submitProductFeedbackDefinition.handler(mockClient, { source: 'dashboard' }),
    ).rejects.toThrow('Unauthorized');
  });

  it('should have correct tool definition metadata', () => {
    expect(submitProductFeedbackDefinition.name).toBe('submit_product_feedback');
    expect(submitProductFeedbackDefinition.description).toBe(
      'Submit product feedback to Metabase',
    );
    expect(submitProductFeedbackDefinition.inputSchema).toEqual(SubmitProductFeedbackInputSchema);
  });
});
