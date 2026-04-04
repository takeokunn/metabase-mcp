import { GetPublicDocumentSchema } from '@src/schemas/public';
import { getPublicDocumentDefinition } from '@src/tools/public/get-public-document';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('getPublicDocument tool', () => {
  const input = { uuid: '550e8400-e29b-41d4-a716-446655440000' };

  it('should return formatted MCP response', async () => {
    const mockResult = { id: 1, name: 'Public Document' };
    const mockClient = createMockClientWithResponse('get', mockResult);
    const result = await getPublicDocumentDefinition.handler(mockClient, input);
    expectMcpContent(result, mockResult);
    expect(mockClient.get).toHaveBeenCalledWith(
      '/api/public/document/550e8400-e29b-41d4-a716-446655440000',
    );
    expect(mockClient.get).toHaveBeenCalledOnce();
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'API error');
    await expect(getPublicDocumentDefinition.handler(mockClient, input)).rejects.toThrow(
      'API error',
    );
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Not Found', 404));
    await expect(getPublicDocumentDefinition.handler(mockClient, input)).rejects.toThrow(
      'Not Found',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(getPublicDocumentDefinition.name).toBe('get_public_document');
    expect(getPublicDocumentDefinition.description).toBe(
      'Get a publicly shared document by UUID from Metabase',
    );
    expect(getPublicDocumentDefinition.inputSchema).toEqual(GetPublicDocumentSchema);
  });
});
