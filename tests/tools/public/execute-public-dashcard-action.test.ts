import { ExecutePublicDashcardActionSchema } from '@src/schemas/public';
import { executePublicDashcardActionDefinition } from '@src/tools/public/execute-public-dashcard-action';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('executePublicDashcardAction tool', () => {
  const input = { uuid: '550e8400-e29b-41d4-a716-446655440000', dashcard_id: 42, parameters: { name: 'test' } };

  it('should return formatted MCP response', async () => {
    const mockResult = { success: true };
    const mockClient = createMockClientWithResponse('post', mockResult);
    const result = await executePublicDashcardActionDefinition.handler(mockClient, input);
    expectMcpContent(result, mockResult);
    expect(mockClient.post).toHaveBeenCalledWith(
      `/api/public/dashboard/${input.uuid}/dashcard/${input.dashcard_id}/execute`,
      { parameters: input.parameters },
    );
  });

  it('should use empty object when parameters is undefined', async () => {
    const mockClient = createMockClientWithResponse('post', { success: true });
    await executePublicDashcardActionDefinition.handler(mockClient, { uuid: input.uuid, dashcard_id: input.dashcard_id });
    expect(mockClient.post).toHaveBeenCalledWith(
      `/api/public/dashboard/${input.uuid}/dashcard/${input.dashcard_id}/execute`,
      { parameters: {} },
    );
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('post', 'API error');
    await expect(executePublicDashcardActionDefinition.handler(mockClient, input)).rejects.toThrow('API error');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('post', createApiError('Unauthorized', 401));
    await expect(executePublicDashcardActionDefinition.handler(mockClient, input)).rejects.toThrow('Unauthorized');
  });

  it('should have correct tool definition metadata', () => {
    expect(executePublicDashcardActionDefinition.name).toBe('execute_public_dashcard_action');
    expect(executePublicDashcardActionDefinition.description).toBe('Execute an action on a public dashcard in Metabase');
    expect(executePublicDashcardActionDefinition.inputSchema).toEqual(ExecutePublicDashcardActionSchema);
  });
});
