import { CopyCardParamsSchema } from '@src/schemas/card';
import { copyCardDefinition } from '@src/tools/card/copy-card';
import { describe, expect, it } from 'vitest';

import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('copyCard tool', () => {
  it('should return formatted MCP response with copied card', async () => {
    const mockCopiedCard = { id: 10, name: 'Sales Overview (Copy)', collection_id: null };
    const mockClient = createMockClientWithResponse('post', mockCopiedCard);

    const result = await copyCardDefinition.handler(mockClient, { id: 1 });

    expectMcpContent(result, mockCopiedCard);
    expect(mockClient.post).toHaveBeenCalledWith('/api/card/1/copy', {});
    expect(mockClient.post).toHaveBeenCalledOnce();
  });

  it('should copy card with custom name', async () => {
    const mockCopiedCard = { id: 15, name: 'My Custom Copy', collection_id: null };
    const mockClient = createMockClientWithResponse('post', mockCopiedCard);

    await copyCardDefinition.handler(mockClient, { id: 5, name: 'My Custom Copy' });

    expect(mockClient.post).toHaveBeenCalledWith('/api/card/5/copy', { name: 'My Custom Copy' });
  });

  it('should copy card to a different collection', async () => {
    const mockCopiedCard = { id: 20, name: 'Copied Card', collection_id: 10 };
    const mockClient = createMockClientWithResponse('post', mockCopiedCard);

    await copyCardDefinition.handler(mockClient, { id: 3, collection_id: 10 });

    expect(mockClient.post).toHaveBeenCalledWith('/api/card/3/copy', { collection_id: 10 });
  });

  it('should copy card with both name and collection_id', async () => {
    const mockCopiedCard = { id: 25, name: 'New Name', collection_id: 15 };
    const mockClient = createMockClientWithResponse('post', mockCopiedCard);

    await copyCardDefinition.handler(mockClient, { id: 7, name: 'New Name', collection_id: 15 });

    expect(mockClient.post).toHaveBeenCalledWith('/api/card/7/copy', {
      name: 'New Name',
      collection_id: 15,
    });
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('post', 'Card not found');
    await expect(copyCardDefinition.handler(mockClient, { id: 999 })).rejects.toThrow(
      'Card not found',
    );
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('post', createApiError('Forbidden', 403));
    await expect(copyCardDefinition.handler(mockClient, { id: 1 })).rejects.toThrow('Forbidden');
  });

  it('should have correct tool definition metadata', () => {
    expect(copyCardDefinition.name).toBe('copy_card');
    expect(copyCardDefinition.description).toBe(
      'Copy an existing card (saved question) in Metabase',
    );
    expect(copyCardDefinition.inputSchema).toEqual(CopyCardParamsSchema);
  });
});
