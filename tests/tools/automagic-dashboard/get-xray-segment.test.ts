import { GetXraySegmentParamsSchema } from '@src/schemas/automagic-dashboard';
import { getXraySegmentDefinition } from '@src/tools/automagic-dashboard/get-xray-segment';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('getXraySegment tool', () => {
  it('should return formatted MCP response', async () => {
    const mockResult = { id: 'automagic-dashboards/segment/1', name: 'Segment X-ray' };
    const mockClient = createMockClientWithResponse('get', mockResult);
    const result = await getXraySegmentDefinition.handler(mockClient, { id: 1 });
    expectMcpContent(result, mockResult);
    expect(mockClient.get).toHaveBeenCalledWith('/api/automagic-dashboards/segment/1');
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'API error');
    await expect(getXraySegmentDefinition.handler(mockClient, { id: 1 })).rejects.toThrow('API error');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Unauthorized', 401));
    await expect(getXraySegmentDefinition.handler(mockClient, { id: 1 })).rejects.toThrow('Unauthorized');
  });

  it('should have correct metadata', () => {
    expect(getXraySegmentDefinition.name).toBe('get_xray_segment');
    expect(getXraySegmentDefinition.inputSchema).toEqual(GetXraySegmentParamsSchema);
  });
});
