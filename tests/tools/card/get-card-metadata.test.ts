import { GetCardMetadataParamsSchema } from '@src/schemas/card';
import { getCardMetadataDefinition } from '@src/tools/card/get-card-metadata';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('getCardMetadata tool', () => {
  it('should return formatted MCP response with card metadata', async () => {
    const mockMetadata = {
      columns: [
        { name: 'id', base_type: 'type/Integer', display_name: 'ID' },
        { name: 'name', base_type: 'type/Text', display_name: 'Name' },
        { name: 'price', base_type: 'type/Decimal', display_name: 'Price' },
      ],
      tables: [{ id: 1, name: 'products', schema: 'public' }],
      databases: [{ id: 1, name: 'Sample Database' }],
    };

    const mockClient = createMockClientWithResponse('get', mockMetadata);

    const result = await getCardMetadataDefinition.handler(mockClient, { id: 1 });

    expectMcpContent(result, mockMetadata);
    expect(mockClient.get).toHaveBeenCalledWith('/api/card/1/query_metadata');
    expect(mockClient.get).toHaveBeenCalledOnce();
  });

  it('should handle metadata with multiple tables', async () => {
    const mockMetadata = {
      columns: [
        { name: 'order_id', base_type: 'type/Integer' },
        { name: 'product_name', base_type: 'type/Text' },
        { name: 'customer_name', base_type: 'type/Text' },
      ],
      tables: [
        { id: 1, name: 'orders', schema: 'public' },
        { id: 2, name: 'products', schema: 'public' },
        { id: 3, name: 'customers', schema: 'public' },
      ],
    };

    const mockClient = createMockClientWithResponse('get', mockMetadata);

    const result = await getCardMetadataDefinition.handler(mockClient, { id: 42 });

    expectMcpContent(result, mockMetadata);
    expect(mockClient.get).toHaveBeenCalledWith('/api/card/42/query_metadata');
  });

  it('should handle minimal metadata', async () => {
    const mockMetadata = {
      columns: [],
      tables: [],
    };

    const mockClient = createMockClientWithResponse('get', mockMetadata);

    const result = await getCardMetadataDefinition.handler(mockClient, { id: 5 });

    expectMcpContent(result, mockMetadata);
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'Card not found');

    await expect(getCardMetadataDefinition.handler(mockClient, { id: 999 })).rejects.toThrow(
      'Card not found',
    );
    expect(mockClient.get).toHaveBeenCalledWith('/api/card/999/query_metadata');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Unauthorized', 401));

    await expect(getCardMetadataDefinition.handler(mockClient, { id: 1 })).rejects.toThrow(
      'Unauthorized',
    );
  });

  it('should propagate forbidden errors', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Forbidden', 403));

    await expect(getCardMetadataDefinition.handler(mockClient, { id: 1 })).rejects.toThrow(
      'Forbidden',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(getCardMetadataDefinition.name).toBe('get_card_metadata');
    expect(getCardMetadataDefinition.description).toBe(
      'Get query metadata (columns, types, etc.) for a card (saved question)',
    );
    expect(getCardMetadataDefinition.inputSchema).toEqual(GetCardMetadataParamsSchema);
  });
});
