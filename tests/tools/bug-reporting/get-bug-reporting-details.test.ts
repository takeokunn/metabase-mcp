import { getBugReportingDetailsDefinition } from '@src/tools/bug-reporting/get-bug-reporting-details';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('getBugReportingDetails tool', () => {
  it('should return formatted MCP response with details', async () => {
    const mockResult = { version: '1.0.0', settings: { db: 'postgres' } };
    const mockClient = createMockClientWithResponse('get', mockResult);
    const result = await getBugReportingDetailsDefinition.handler(mockClient, {});
    expectMcpContent(result, mockResult);
  });

  it('should call correct endpoint', async () => {
    const mockClient = createMockClientWithResponse('get', {});
    await getBugReportingDetailsDefinition.handler(mockClient, {});
    expect(mockClient.get).toHaveBeenCalledWith('/api/bug-reporting/details');
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'API error');
    await expect(getBugReportingDetailsDefinition.handler(mockClient, {})).rejects.toThrow('API error');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Forbidden', 403));
    await expect(getBugReportingDetailsDefinition.handler(mockClient, {})).rejects.toThrow('Forbidden');
  });
});
