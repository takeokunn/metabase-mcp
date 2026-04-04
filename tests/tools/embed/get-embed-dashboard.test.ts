import { GetEmbedDashboardParamsSchema } from '@src/schemas/embed';
import { getEmbedDashboardDefinition } from '@src/tools/embed/get-embed-dashboard';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('getEmbedDashboard tool', () => {
  const input = { token: 'test-embed-token-abc123' };

  it('should return formatted MCP response', async () => {
    const mockResult = { id: 1, name: 'Executive Dashboard', dashcards: [] };
    const mockClient = createMockClientWithResponse('get', mockResult);
    const result = await getEmbedDashboardDefinition.handler(mockClient, input);
    expectMcpContent(result, mockResult);
    expect(mockClient.get).toHaveBeenCalledWith(`/api/embed/dashboard/${input.token}`);
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'API error');
    await expect(getEmbedDashboardDefinition.handler(mockClient, input)).rejects.toThrow(
      'API error',
    );
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Not Found', 404));
    await expect(getEmbedDashboardDefinition.handler(mockClient, input)).rejects.toThrow(
      'Not Found',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(getEmbedDashboardDefinition.name).toBe('get_embed_dashboard');
    expect(getEmbedDashboardDefinition.inputSchema).toEqual(GetEmbedDashboardParamsSchema);
  });
});
