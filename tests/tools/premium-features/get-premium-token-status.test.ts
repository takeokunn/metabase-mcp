import { getPremiumTokenStatusDefinition } from '@src/tools/premium-features/get-premium-token-status';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('getPremiumTokenStatus tool', () => {
  it('should return formatted MCP response with token status', async () => {
    const mockResult = { valid: true, status: 'active', features: ['audit-app'] };
    const mockClient = createMockClientWithResponse('get', mockResult);
    const result = await getPremiumTokenStatusDefinition.handler(mockClient, {});
    expectMcpContent(result, mockResult);
  });

  it('should have EE annotation in description', () => {
    expect(getPremiumTokenStatusDefinition.description).toContain('[Requires Metabase Pro]');
  });

  it('should call correct endpoint', async () => {
    const mockClient = createMockClientWithResponse('get', {});
    await getPremiumTokenStatusDefinition.handler(mockClient, {});
    expect(mockClient.get).toHaveBeenCalledWith('/api/premium-features/token/status');
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'API error');
    await expect(getPremiumTokenStatusDefinition.handler(mockClient, {})).rejects.toThrow(
      'API error',
    );
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Unauthorized', 401));
    await expect(getPremiumTokenStatusDefinition.handler(mockClient, {})).rejects.toThrow(
      'Unauthorized',
    );
  });
});
