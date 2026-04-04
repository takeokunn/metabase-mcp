import { refreshPremiumTokenDefinition } from '@src/tools/premium-features/refresh-premium-token';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('refreshPremiumToken tool', () => {
  it('should return formatted MCP response', async () => {
    const mockResult = { success: true, valid: true };
    const mockClient = createMockClientWithResponse('post', mockResult);
    const result = await refreshPremiumTokenDefinition.handler(mockClient, {});
    expectMcpContent(result, mockResult);
  });

  it('should have EE annotation in description', () => {
    expect(refreshPremiumTokenDefinition.description).toContain('[Requires Metabase Pro]');
  });

  it('should call correct endpoint', async () => {
    const mockClient = createMockClientWithResponse('post', {});
    await refreshPremiumTokenDefinition.handler(mockClient, {});
    expect(mockClient.post).toHaveBeenCalledWith('/api/premium-features/token/refresh');
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('post', 'API error');
    await expect(refreshPremiumTokenDefinition.handler(mockClient, {})).rejects.toThrow('API error');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('post', createApiError('Forbidden', 403));
    await expect(refreshPremiumTokenDefinition.handler(mockClient, {})).rejects.toThrow('Forbidden');
  });
});
