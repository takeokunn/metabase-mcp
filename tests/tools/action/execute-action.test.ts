import { ExecuteActionInputSchema } from '@src/schemas/action';
import { executeActionDefinition } from '@src/tools/action/execute-action';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('executeAction tool', () => {
  it('should return formatted MCP response after execution', async () => {
    const mockResult = { success: true, rows_affected: 1 };
    const mockClient = createMockClientWithResponse('post', mockResult);

    const result = await executeActionDefinition.handler(mockClient, {
      id: 1,
      parameters: { customer_id: 42, name: 'Alice' },
    });

    expectMcpContent(result, mockResult);
    expect(mockClient.post).toHaveBeenCalledWith('/api/action/1/execute', {
      parameters: { customer_id: 42, name: 'Alice' },
    });
    expect(mockClient.post).toHaveBeenCalledOnce();
  });

  it('should handle empty parameters object', async () => {
    const mockResult = { success: true };
    const mockClient = createMockClientWithResponse('post', mockResult);

    const result = await executeActionDefinition.handler(mockClient, { id: 2, parameters: {} });

    expectMcpContent(result, mockResult);
    expect(mockClient.post).toHaveBeenCalledWith('/api/action/2/execute', { parameters: {} });
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('post', 'Execution failed');
    await expect(
      executeActionDefinition.handler(mockClient, { id: 1, parameters: {} }),
    ).rejects.toThrow('Execution failed');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('post', createApiError('Bad Request', 400));
    await expect(
      executeActionDefinition.handler(mockClient, { id: 1, parameters: { id: 'invalid' } }),
    ).rejects.toThrow('Bad Request');
  });

  it('should have correct tool definition metadata', () => {
    expect(executeActionDefinition.name).toBe('execute_action');
    expect(executeActionDefinition.inputSchema).toEqual(ExecuteActionInputSchema);
  });
});
