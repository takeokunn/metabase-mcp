import { queryMetabotDefinition } from '@src/tools/metabot/query-metabot';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('queryMetabot tool', () => {
  const input = { message: 'Show me total revenue by month', context: { dashboard_id: 5 } };

  it('should return formatted MCP response', async () => {
    const mockResult = { response: 'Here is the query...', sql: 'SELECT ...' };
    const mockClient = createMockClientWithResponse('post', mockResult);
    const result = await queryMetabotDefinition.handler(mockClient, input);
    expectMcpContent(result, mockResult);
  });

  it('should have EE annotation in description', () => {
    expect(queryMetabotDefinition.description).toContain('[Requires Metabase Pro]');
  });

  it('should call correct endpoint', async () => {
    const mockClient = createMockClientWithResponse('post', {});
    await queryMetabotDefinition.handler(mockClient, input);
    expect(mockClient.post).toHaveBeenCalledWith('/api/metabot/agent', {
      message: input.message,
      context: input.context,
    });
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('post', 'API error');
    await expect(queryMetabotDefinition.handler(mockClient, input)).rejects.toThrow('API error');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('post', createApiError('Unauthorized', 401));
    await expect(queryMetabotDefinition.handler(mockClient, input)).rejects.toThrow('Unauthorized');
  });
});
