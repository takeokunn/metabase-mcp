import { ForceReindexSearchInputSchema } from '@src/schemas/search';
import { forceReindexSearchDefinition } from '@src/tools/search/force-reindex-search';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('forceReindexSearch tool', () => {
  it('should return formatted MCP response', async () => {
    const mockResponse = { success: true };
    const mockClient = createMockClientWithResponse('post', mockResponse);
    const result = await forceReindexSearchDefinition.handler(mockClient, {});
    expectMcpContent(result, mockResponse);
    expect(mockClient.post).toHaveBeenCalledWith('/api/search/force-reindex', {});
    expect(mockClient.post).toHaveBeenCalledOnce();
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('post', 'Not found');
    await expect(forceReindexSearchDefinition.handler(mockClient, {})).rejects.toThrow('Not found');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('post', createApiError('Unauthorized', 401));
    await expect(forceReindexSearchDefinition.handler(mockClient, {})).rejects.toThrow('Unauthorized');
  });

  it('should have correct tool definition metadata', () => {
    expect(forceReindexSearchDefinition.name).toBe('force_reindex_search');
    expect(forceReindexSearchDefinition.description).toBe('Force a full reindex of the search index in Metabase');
    expect(forceReindexSearchDefinition.inputSchema).toEqual(ForceReindexSearchInputSchema);
  });
});
