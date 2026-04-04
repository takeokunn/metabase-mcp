import { GetXrayCardParamsSchema } from '@src/schemas/automagic-dashboard';
import { getXrayCardDefinition } from '@src/tools/automagic-dashboard/get-xray-card';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('getXrayCard tool', () => {
  it('should return formatted MCP response', async () => {
    const mockResult = { id: 'automagic-dashboards/question/1', name: 'Card X-ray' };
    const mockClient = createMockClientWithResponse('get', mockResult);
    const result = await getXrayCardDefinition.handler(mockClient, { id: 1 });
    expectMcpContent(result, mockResult);
    expect(mockClient.get).toHaveBeenCalledWith('/api/automagic-dashboards/question/1');
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'API error');
    await expect(getXrayCardDefinition.handler(mockClient, { id: 1 })).rejects.toThrow('API error');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Unauthorized', 401));
    await expect(getXrayCardDefinition.handler(mockClient, { id: 1 })).rejects.toThrow('Unauthorized');
  });

  it('should have correct metadata', () => {
    expect(getXrayCardDefinition.name).toBe('get_xray_card');
    expect(getXrayCardDefinition.inputSchema).toEqual(GetXrayCardParamsSchema);
  });
});
