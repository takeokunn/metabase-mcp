import { createModelIndexDefinition } from '@src/tools/model-index/create-model-index';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('createModelIndex tool', () => {
  it('should return formatted MCP response', async () => {
    const mockResult = { id: 1, model_id: 5, state: 'indexed' };
    const mockClient = createMockClientWithResponse('post', mockResult);
    const input = {
      model_id: 5,
      pk_ref: { field_id: 1 },
      value_ref: { field_id: 2 },
    };
    const result = await createModelIndexDefinition.handler(mockClient, input);
    expectMcpContent(result, mockResult);
    expect(mockClient.post).toHaveBeenCalledWith('/api/model-index', input);
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('post', 'API error');
    await expect(
      createModelIndexDefinition.handler(mockClient, {
        model_id: 5,
        pk_ref: {},
        value_ref: {},
      }),
    ).rejects.toThrow('API error');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('post', createApiError('Bad Request', 400));
    await expect(
      createModelIndexDefinition.handler(mockClient, {
        model_id: 5,
        pk_ref: {},
        value_ref: {},
      }),
    ).rejects.toThrow('Bad Request');
  });

  it('should have correct tool definition metadata', () => {
    expect(createModelIndexDefinition.name).toBe('create_model_index');
  });
});
