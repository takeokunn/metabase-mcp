import { ReinitSearchInputSchema } from '@src/schemas/search';
import { reinitSearchDefinition } from '@src/tools/search/reinit-search';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('reinitSearch tool', () => {
  it('should return formatted MCP response', async () => {
    const mockResponse = { success: true };
    const mockClient = createMockClientWithResponse('post', mockResponse);
    const result = await reinitSearchDefinition.handler(mockClient, {});
    expectMcpContent(result, mockResponse);
    expect(mockClient.post).toHaveBeenCalledWith('/api/search/re-init', {});
    expect(mockClient.post).toHaveBeenCalledOnce();
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('post', 'Not found');
    await expect(reinitSearchDefinition.handler(mockClient, {})).rejects.toThrow('Not found');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('post', createApiError('Unauthorized', 401));
    await expect(reinitSearchDefinition.handler(mockClient, {})).rejects.toThrow('Unauthorized');
  });

  it('should have correct tool definition metadata', () => {
    expect(reinitSearchDefinition.name).toBe('reinit_search');
    expect(reinitSearchDefinition.description).toBe('Re-initialize the search index in Metabase');
    expect(reinitSearchDefinition.inputSchema).toEqual(ReinitSearchInputSchema);
  });
});
