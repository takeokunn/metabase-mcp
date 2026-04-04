import { GetXrayTableParamsSchema } from '@src/schemas/automagic-dashboard';
import { getXrayTableDefinition } from '@src/tools/automagic-dashboard/get-xray-table';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('getXrayTable tool', () => {
  it('should return formatted MCP response', async () => {
    const mockResult = { id: 'automagic-dashboards/table/1', name: 'Table X-ray' };
    const mockClient = createMockClientWithResponse('get', mockResult);
    const result = await getXrayTableDefinition.handler(mockClient, { id: 1 });
    expectMcpContent(result, mockResult);
    expect(mockClient.get).toHaveBeenCalledWith('/api/automagic-dashboards/table/1');
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'API error');
    await expect(getXrayTableDefinition.handler(mockClient, { id: 1 })).rejects.toThrow('API error');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Unauthorized', 401));
    await expect(getXrayTableDefinition.handler(mockClient, { id: 1 })).rejects.toThrow('Unauthorized');
  });

  it('should have correct metadata', () => {
    expect(getXrayTableDefinition.name).toBe('get_xray_table');
    expect(getXrayTableDefinition.inputSchema).toEqual(GetXrayTableParamsSchema);
  });
});
