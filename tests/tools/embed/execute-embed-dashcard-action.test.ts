import { ExecuteEmbedDashcardActionSchema } from '@src/schemas/embed';
import { executeEmbedDashcardActionDefinition } from '@src/tools/embed/execute-embed-dashcard-action';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('executeEmbedDashcardAction tool', () => {
  const input = { token: 'test-embed-token-abc123', dashcard_id: 42, parameters: { name: 'test' } };

  it('should return formatted MCP response', async () => {
    const mockResult = { success: true };
    const mockClient = createMockClientWithResponse('post', mockResult);
    const result = await executeEmbedDashcardActionDefinition.handler(mockClient, input);
    expectMcpContent(result, mockResult);
    expect(mockClient.post).toHaveBeenCalledWith(
      `/api/embed/dashboard/${input.token}/dashcard/${input.dashcard_id}/execute`,
      { parameters: input.parameters },
    );
  });

  it('should use empty object when parameters is undefined', async () => {
    const mockClient = createMockClientWithResponse('post', { success: true });
    await executeEmbedDashcardActionDefinition.handler(mockClient, { token: input.token, dashcard_id: input.dashcard_id });
    expect(mockClient.post).toHaveBeenCalledWith(
      `/api/embed/dashboard/${input.token}/dashcard/${input.dashcard_id}/execute`,
      { parameters: {} },
    );
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('post', 'API error');
    await expect(executeEmbedDashcardActionDefinition.handler(mockClient, input)).rejects.toThrow('API error');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('post', createApiError('Unauthorized', 401));
    await expect(executeEmbedDashcardActionDefinition.handler(mockClient, input)).rejects.toThrow('Unauthorized');
  });

  it('should have correct tool definition metadata', () => {
    expect(executeEmbedDashcardActionDefinition.name).toBe('execute_embed_dashcard_action');
    expect(executeEmbedDashcardActionDefinition.description).toBe('Execute an action on an embedded dashcard in Metabase');
    expect(executeEmbedDashcardActionDefinition.inputSchema).toEqual(ExecuteEmbedDashcardActionSchema);
  });
});
