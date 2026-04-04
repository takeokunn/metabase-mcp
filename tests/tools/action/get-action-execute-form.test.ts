import { GetActionExecuteFormParamsSchema } from '@src/schemas/action';
import { getActionExecuteFormDefinition } from '@src/tools/action/get-action-execute-form';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('getActionExecuteForm tool', () => {
  it('should return formatted MCP response with execute form fields', async () => {
    const mockForm = {
      parameters: [
        { id: 'customer_id', name: 'Customer ID', type: 'number', required: true },
        { id: 'name', name: 'Name', type: 'string', required: false },
      ],
    };
    const mockClient = createMockClientWithResponse('get', mockForm);

    const result = await getActionExecuteFormDefinition.handler(mockClient, { id: 1 });

    expectMcpContent(result, mockForm);
    expect(mockClient.get).toHaveBeenCalledWith('/api/action/1/execute');
    expect(mockClient.get).toHaveBeenCalledOnce();
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'API error');
    await expect(getActionExecuteFormDefinition.handler(mockClient, { id: 1 })).rejects.toThrow(
      'API error',
    );
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Not found', 404));
    await expect(getActionExecuteFormDefinition.handler(mockClient, { id: 999 })).rejects.toThrow(
      'Not found',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(getActionExecuteFormDefinition.name).toBe('get_action_execute_form');
    expect(getActionExecuteFormDefinition.inputSchema).toEqual(GetActionExecuteFormParamsSchema);
  });
});
