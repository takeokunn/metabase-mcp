import { GetPublicOembedSchema } from '@src/schemas/public';
import { getPublicOembedDefinition } from '@src/tools/public/get-public-oembed';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('getPublicOembed tool', () => {
  const input = {
    url: 'https://metabase.example.com/public/question/abc123',
    maxheight: 600,
    maxwidth: 800,
  };

  it('should return formatted MCP response', async () => {
    const mockResult = { type: 'rich', html: '<iframe></iframe>' };
    const mockClient = createMockClientWithResponse('get', mockResult);
    const result = await getPublicOembedDefinition.handler(mockClient, input);
    expectMcpContent(result, mockResult);
    expect(mockClient.get).toHaveBeenCalledWith('/api/public/oembed', {
      url: input.url,
      maxheight: input.maxheight,
      maxwidth: input.maxwidth,
    });
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'API error');
    await expect(getPublicOembedDefinition.handler(mockClient, input)).rejects.toThrow('API error');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Not Found', 404));
    await expect(getPublicOembedDefinition.handler(mockClient, input)).rejects.toThrow('Not Found');
  });

  it('should have correct tool definition metadata', () => {
    expect(getPublicOembedDefinition.name).toBe('get_public_oembed');
    expect(getPublicOembedDefinition.description).toBe(
      'Get oEmbed metadata for a public Metabase resource',
    );
    expect(getPublicOembedDefinition.inputSchema).toEqual(GetPublicOembedSchema);
  });
});
