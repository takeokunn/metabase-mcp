import { GetPublicDocumentCardSchema } from '@src/schemas/public';
import { getPublicDocumentCardDefinition } from '@src/tools/public/get-public-document-card';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('getPublicDocumentCard tool', () => {
  const input = { uuid: '550e8400-e29b-41d4-a716-446655440000', card_id: 42 };

  it('should return formatted MCP response', async () => {
    const mockResult = { id: 42, name: 'Card in Document' };
    const mockClient = createMockClientWithResponse('get', mockResult);
    const result = await getPublicDocumentCardDefinition.handler(mockClient, input);
    expectMcpContent(result, mockResult);
    expect(mockClient.get).toHaveBeenCalledWith(
      '/api/public/document/550e8400-e29b-41d4-a716-446655440000/card/42',
    );
    expect(mockClient.get).toHaveBeenCalledOnce();
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'API error');
    await expect(
      getPublicDocumentCardDefinition.handler(mockClient, input),
    ).rejects.toThrow('API error');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Not Found', 404));
    await expect(
      getPublicDocumentCardDefinition.handler(mockClient, input),
    ).rejects.toThrow('Not Found');
  });

  it('should have correct tool definition metadata', () => {
    expect(getPublicDocumentCardDefinition.name).toBe('get_public_document_card');
    expect(getPublicDocumentCardDefinition.description).toBe(
      'Get a card from a publicly shared document by UUID in Metabase',
    );
    expect(getPublicDocumentCardDefinition.inputSchema).toEqual(GetPublicDocumentCardSchema);
  });
});
