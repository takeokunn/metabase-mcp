import { ExecutePreviewEmbedDashcardActionSchema } from '@src/schemas/preview-embed';
import { executePreviewEmbedDashcardActionDefinition } from '@src/tools/preview-embed/execute-preview-embed-dashcard-action';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('executePreviewEmbedDashcardAction tool', () => {
  const input = { token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.preview', dashcard_id: 42, parameters: { name: 'test' } };

  it('should return formatted MCP response', async () => {
    const mockResult = { success: true };
    const mockClient = createMockClientWithResponse('post', mockResult);
    const result = await executePreviewEmbedDashcardActionDefinition.handler(mockClient, input);
    expectMcpContent(result, mockResult);
    expect(mockClient.post).toHaveBeenCalledWith(
      `/api/preview_embed/dashboard/${input.token}/dashcard/${input.dashcard_id}/execute`,
      { parameters: input.parameters },
    );
  });

  it('should use empty object when parameters is undefined', async () => {
    const mockClient = createMockClientWithResponse('post', { success: true });
    await executePreviewEmbedDashcardActionDefinition.handler(mockClient, { token: input.token, dashcard_id: input.dashcard_id });
    expect(mockClient.post).toHaveBeenCalledWith(
      `/api/preview_embed/dashboard/${input.token}/dashcard/${input.dashcard_id}/execute`,
      { parameters: {} },
    );
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('post', 'API error');
    await expect(executePreviewEmbedDashcardActionDefinition.handler(mockClient, input)).rejects.toThrow('API error');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('post', createApiError('Unauthorized', 401));
    await expect(executePreviewEmbedDashcardActionDefinition.handler(mockClient, input)).rejects.toThrow('Unauthorized');
  });

  it('should have correct tool definition metadata', () => {
    expect(executePreviewEmbedDashcardActionDefinition.name).toBe('execute_preview_embed_dashcard_action');
    expect(executePreviewEmbedDashcardActionDefinition.description).toBe('Execute an action on a preview embedded dashcard in Metabase');
    expect(executePreviewEmbedDashcardActionDefinition.inputSchema).toEqual(ExecutePreviewEmbedDashcardActionSchema);
  });
});
