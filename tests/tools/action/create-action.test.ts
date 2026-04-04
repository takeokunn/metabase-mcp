import { CreateActionInputSchema } from '@src/schemas/action';
import { createActionDefinition } from '@src/tools/action/create-action';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('createAction tool', () => {
  const baseInput = {
    name: 'New Action',
    type: 'implicit' as const,
    model_id: 5,
  };

  it('should return formatted MCP response with created action', async () => {
    const mockCreatedAction = { id: 1, name: 'New Action', type: 'implicit', model_id: 5 };
    const mockClient = createMockClientWithResponse('post', mockCreatedAction);

    const result = await createActionDefinition.handler(mockClient, baseInput);

    expectMcpContent(result, mockCreatedAction);
    expect(mockClient.post).toHaveBeenCalledWith('/api/action', baseInput);
    expect(mockClient.post).toHaveBeenCalledOnce();
  });

  it('should include optional fields when provided', async () => {
    const inputWithOptionals = {
      ...baseInput,
      description: 'A test action',
      parameters: [{ name: 'id', type: 'number' }],
    };

    const mockCreatedAction = { id: 2, ...inputWithOptionals };
    const mockClient = createMockClientWithResponse('post', mockCreatedAction);

    const result = await createActionDefinition.handler(mockClient, inputWithOptionals);

    expectMcpContent(result, mockCreatedAction);
    expect(mockClient.post).toHaveBeenCalledWith('/api/action', inputWithOptionals);
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('post', 'Failed to create action');
    await expect(createActionDefinition.handler(mockClient, baseInput)).rejects.toThrow(
      'Failed to create action',
    );
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('post', createApiError('Bad Request', 400));
    await expect(createActionDefinition.handler(mockClient, baseInput)).rejects.toThrow(
      'Bad Request',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(createActionDefinition.name).toBe('create_action');
    expect(createActionDefinition.inputSchema).toEqual(CreateActionInputSchema);
  });
});
