import { listLlmModelsDefinition } from '@src/tools/llm/list-llm-models';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('listLlmModels tool', () => {
  it('should return formatted MCP response with models list', async () => {
    const mockResult = [{ id: 'gpt-4', name: 'GPT-4' }, { id: 'claude-3', name: 'Claude 3' }];
    const mockClient = createMockClientWithResponse('get', mockResult);
    const result = await listLlmModelsDefinition.handler(mockClient, {});
    expectMcpContent(result, mockResult);
  });

  it('should have EE annotation in description', () => {
    expect(listLlmModelsDefinition.description).toContain('[Requires Metabase Pro]');
  });

  it('should call correct endpoint', async () => {
    const mockClient = createMockClientWithResponse('get', []);
    await listLlmModelsDefinition.handler(mockClient, {});
    expect(mockClient.get).toHaveBeenCalledWith('/api/llm/list-models');
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'API error');
    await expect(listLlmModelsDefinition.handler(mockClient, {})).rejects.toThrow('API error');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Unauthorized', 401));
    await expect(listLlmModelsDefinition.handler(mockClient, {})).rejects.toThrow('Unauthorized');
  });
});
