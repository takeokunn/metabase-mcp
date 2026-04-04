import { GetDashcardActionParamsInputSchema } from '@src/schemas/dashboard';
import { getDashcardActionParamsDefinition } from '@src/tools/dashboard/get-dashcard-action-params';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('getDashcardActionParams tool', () => {
  it('should return formatted MCP response with action params', async () => {
    const mockClient = createMockClientWithResponse('get', { params: {} });
    const result = await getDashcardActionParamsDefinition.handler(mockClient, {
      dashboard_id: 1,
      dashcard_id: 2,
    });
    expectMcpContent(result, { params: {} });
    expect(mockClient.get).toHaveBeenCalledWith('/api/dashboard/1/dashcard/2/execute', undefined);
    expect(mockClient.get).toHaveBeenCalledOnce();
  });
  it('should pass parameters when provided', async () => {
    const mockClient = createMockClientWithResponse('get', { params: {} });
    await getDashcardActionParamsDefinition.handler(mockClient, {
      dashboard_id: 1,
      dashcard_id: 2,
      parameters: { key: 'value' },
    });
    expect(mockClient.get).toHaveBeenCalledWith('/api/dashboard/1/dashcard/2/execute', {
      key: 'value',
    });
  });
  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'Not found');
    await expect(
      getDashcardActionParamsDefinition.handler(mockClient, { dashboard_id: 999, dashcard_id: 1 }),
    ).rejects.toThrow('Not found');
  });
  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Unauthorized', 401));
    await expect(
      getDashcardActionParamsDefinition.handler(mockClient, { dashboard_id: 1, dashcard_id: 1 }),
    ).rejects.toThrow('Unauthorized');
  });
  it('should have correct tool definition metadata', () => {
    expect(getDashcardActionParamsDefinition.name).toBe('get_dashcard_action_params');
    expect(getDashcardActionParamsDefinition.description).toBe(
      'Get action parameters for a dashcard in Metabase',
    );
    expect(getDashcardActionParamsDefinition.inputSchema).toEqual(
      GetDashcardActionParamsInputSchema,
    );
  });
});
