import { GetXrayFieldParamsSchema } from '@src/schemas/automagic-dashboard';
import { getXrayFieldDefinition } from '@src/tools/automagic-dashboard/get-xray-field';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('getXrayField tool', () => {
  it('should return formatted MCP response', async () => {
    const mockResult = { id: 'automagic-dashboards/field/1', name: 'Field X-ray' };
    const mockClient = createMockClientWithResponse('get', mockResult);
    const result = await getXrayFieldDefinition.handler(mockClient, { id: 1 });
    expectMcpContent(result, mockResult);
    expect(mockClient.get).toHaveBeenCalledWith('/api/automagic-dashboards/field/1');
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'API error');
    await expect(getXrayFieldDefinition.handler(mockClient, { id: 1 })).rejects.toThrow('API error');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Unauthorized', 401));
    await expect(getXrayFieldDefinition.handler(mockClient, { id: 1 })).rejects.toThrow('Unauthorized');
  });

  it('should have correct metadata', () => {
    expect(getXrayFieldDefinition.name).toBe('get_xray_field');
    expect(getXrayFieldDefinition.inputSchema).toEqual(GetXrayFieldParamsSchema);
  });
});
