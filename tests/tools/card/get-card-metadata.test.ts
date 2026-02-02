import type { MetabaseClient } from '@src/client';
import { GetCardMetadataParamsSchema } from '@src/schemas/card';
import { getCardMetadataDefinition } from '@src/tools/card/get-card-metadata';
import { describe, expect, it, vi } from 'vitest';

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

    const mockClient = {
      get: vi.fn().mockResolvedValue(mockMetadata),
    } as unknown as MetabaseClient;

    const result = await getCardMetadataDefinition.handler(mockClient, { id: 1 });

    expect(result.content).toHaveLength(1);
    expect(result.content[0].type).toBe('text');
    expect(JSON.parse((result.content[0] as { text: string }).text)).toEqual(mockMetadata);
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

    const mockClient = {
      get: vi.fn().mockResolvedValue(mockMetadata),
    } as unknown as MetabaseClient;

    const result = await getCardMetadataDefinition.handler(mockClient, { id: 42 });

    const parsedResult = JSON.parse((result.content[0] as { text: string }).text);
    expect(parsedResult.tables).toHaveLength(3);
    expect(mockClient.get).toHaveBeenCalledWith('/api/card/42/query_metadata');
  });

  it('should handle minimal metadata', async () => {
    const mockMetadata = {
      columns: [],
      tables: [],
    };

    const mockClient = {
      get: vi.fn().mockResolvedValue(mockMetadata),
    } as unknown as MetabaseClient;

    const result = await getCardMetadataDefinition.handler(mockClient, { id: 5 });

    expect(result.content[0].type).toBe('text');
    expect(JSON.parse((result.content[0] as { text: string }).text)).toEqual(mockMetadata);
  });

  it('should propagate client errors', async () => {
    const mockClient = {
      get: vi.fn().mockRejectedValue(new Error('Card not found')),
    } as unknown as MetabaseClient;

    await expect(getCardMetadataDefinition.handler(mockClient, { id: 999 })).rejects.toThrow(
      'Card not found',
    );
    expect(mockClient.get).toHaveBeenCalledWith('/api/card/999/query_metadata');
  });

  it('should propagate API errors with status codes', async () => {
    const apiError = new Error('Unauthorized');
    (apiError as Error & { status?: number }).status = 401;

    const mockClient = {
      get: vi.fn().mockRejectedValue(apiError),
    } as unknown as MetabaseClient;

    await expect(getCardMetadataDefinition.handler(mockClient, { id: 1 })).rejects.toThrow(
      'Unauthorized',
    );
  });

  it('should propagate forbidden errors', async () => {
    const apiError = new Error('Forbidden');
    (apiError as Error & { status?: number }).status = 403;

    const mockClient = {
      get: vi.fn().mockRejectedValue(apiError),
    } as unknown as MetabaseClient;

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
