import { ExecutePublicActionSchema } from '@src/schemas/public';
import { executePublicActionDefinition } from '@src/tools/public/execute-public-action';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('executePublicAction tool', () => {
  const input = { uuid: '550e8400-e29b-41d4-a716-446655440000', parameters: { name: 'test' } };

  it('should return formatted MCP response', async () => {
    const mockResult = { success: true };
    const mockClient = createMockClientWithResponse('post', mockResult);
    const result = await executePublicActionDefinition.handler(mockClient, input);
    expectMcpContent(result, mockResult);
    expect(mockClient.post).toHaveBeenCalledWith(
      `/api/public/action/${input.uuid}/execute`,
      { parameters: input.parameters },
    );
  });

  it('should use empty object when parameters is undefined', async () => {
    const mockClient = createMockClientWithResponse('post', { success: true });
    await executePublicActionDefinition.handler(mockClient, { uuid: input.uuid });
    expect(mockClient.post).toHaveBeenCalledWith(
      `/api/public/action/${input.uuid}/execute`,
      { parameters: {} },
    );
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('post', 'API error');
    await expect(executePublicActionDefinition.handler(mockClient, input)).rejects.toThrow('API error');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('post', createApiError('Unauthorized', 401));
    await expect(executePublicActionDefinition.handler(mockClient, input)).rejects.toThrow('Unauthorized');
  });

  it('should have correct tool definition metadata', () => {
    expect(executePublicActionDefinition.name).toBe('execute_public_action');
    expect(executePublicActionDefinition.description).toBe('Execute a public action in Metabase');
    expect(executePublicActionDefinition.inputSchema).toEqual(ExecutePublicActionSchema);
  });
});
