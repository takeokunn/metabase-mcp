import { ExecuteDashcardActionInputSchema } from '@src/schemas/dashboard';
import { executeDashcardActionDefinition } from '@src/tools/dashboard/execute-dashcard-action';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('executeDashcardAction tool', () => {
  it('should return formatted MCP response with action result', async () => {
    const mockClient = createMockClientWithResponse('post', { success: true });
    const result = await executeDashcardActionDefinition.handler(mockClient, { dashboard_id: 1, dashcard_id: 2, parameters: { key: 'value' } });
    expectMcpContent(result, { success: true });
    expect(mockClient.post).toHaveBeenCalledWith('/api/dashboard/1/dashcard/2/execute', { parameters: { key: 'value' } });
    expect(mockClient.post).toHaveBeenCalledOnce();
  });
  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('post', 'Not found');
    await expect(executeDashcardActionDefinition.handler(mockClient, { dashboard_id: 999, dashcard_id: 1, parameters: {} })).rejects.toThrow('Not found');
  });
  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('post', createApiError('Unauthorized', 401));
    await expect(executeDashcardActionDefinition.handler(mockClient, { dashboard_id: 1, dashcard_id: 1, parameters: {} })).rejects.toThrow('Unauthorized');
  });
  it('should have correct tool definition metadata', () => {
    expect(executeDashcardActionDefinition.name).toBe('execute_dashcard_action');
    expect(executeDashcardActionDefinition.description).toBe('Execute an action on a dashcard in Metabase');
    expect(executeDashcardActionDefinition.inputSchema).toEqual(ExecuteDashcardActionInputSchema);
  });
});
