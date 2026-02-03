import { GetTableMetadataParamsSchema } from '@src/schemas/table';
import { getTableMetadataDefinition } from '@src/tools/table/get-table-metadata';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('getTableMetadata tool', () => {
  it('should return formatted MCP response with table metadata', async () => {
    const mockMetadata = {
      id: 1,
      name: 'users',
      display_name: 'Users',
      db_id: 1,
      schema: 'public',
      fields: [
        { id: 1, name: 'id', base_type: 'type/Integer', display_name: 'ID' },
        { id: 2, name: 'name', base_type: 'type/Text', display_name: 'Name' },
        { id: 3, name: 'email', base_type: 'type/Text', display_name: 'Email' },
      ],
    };

    const mockClient = createMockClientWithResponse('get', mockMetadata);

    const result = await getTableMetadataDefinition.handler(mockClient, { id: 1 });

    expectMcpContent(result, mockMetadata);
    expect(mockClient.get).toHaveBeenCalledWith('/api/table/1/query_metadata', undefined);
    expect(mockClient.get).toHaveBeenCalledOnce();
  });

  it('should include hidden fields when include_hidden_fields is true', async () => {
    const mockMetadata = {
      id: 5,
      name: 'orders',
      fields: [
        { id: 1, name: 'id', base_type: 'type/Integer', visibility_type: 'normal' },
        { id: 2, name: 'internal_id', base_type: 'type/Text', visibility_type: 'hidden' },
        { id: 3, name: 'status', base_type: 'type/Text', visibility_type: 'normal' },
      ],
    };

    const mockClient = createMockClientWithResponse('get', mockMetadata);

    const result = await getTableMetadataDefinition.handler(mockClient, {
      id: 5,
      include_hidden_fields: true,
    });

    expectMcpContent(result, mockMetadata);
    expect(mockClient.get).toHaveBeenCalledWith('/api/table/5/query_metadata', {
      include_hidden_fields: true,
    });
  });

  it('should exclude hidden fields when include_hidden_fields is false', async () => {
    const mockMetadata = {
      id: 5,
      name: 'orders',
      fields: [
        { id: 1, name: 'id', base_type: 'type/Integer', visibility_type: 'normal' },
        { id: 3, name: 'status', base_type: 'type/Text', visibility_type: 'normal' },
      ],
    };

    const mockClient = createMockClientWithResponse('get', mockMetadata);

    const result = await getTableMetadataDefinition.handler(mockClient, {
      id: 5,
      include_hidden_fields: false,
    });

    expectMcpContent(result, mockMetadata);
    expect(mockClient.get).toHaveBeenCalledWith('/api/table/5/query_metadata', {
      include_hidden_fields: false,
    });
  });

  it('should not pass params when include_hidden_fields is undefined', async () => {
    const mockMetadata = {
      id: 10,
      name: 'products',
      fields: [],
    };

    const mockClient = createMockClientWithResponse('get', mockMetadata);

    await getTableMetadataDefinition.handler(mockClient, { id: 10 });

    expect(mockClient.get).toHaveBeenCalledWith('/api/table/10/query_metadata', undefined);
  });

  it('should handle metadata with relationships', async () => {
    const mockMetadata = {
      id: 3,
      name: 'orders',
      fields: [
        {
          id: 1,
          name: 'user_id',
          base_type: 'type/Integer',
          fk_target_field_id: 100,
          fk_target_table_id: 1,
        },
        {
          id: 2,
          name: 'product_id',
          base_type: 'type/Integer',
          fk_target_field_id: 200,
          fk_target_table_id: 2,
        },
      ],
      dimension_options: {},
    };

    const mockClient = createMockClientWithResponse('get', mockMetadata);

    const result = await getTableMetadataDefinition.handler(mockClient, { id: 3 });

    expectMcpContent(result, mockMetadata);
  });

  it('should handle metadata with dimension options', async () => {
    const mockMetadata = {
      id: 7,
      name: 'events',
      fields: [{ id: 1, name: 'timestamp', base_type: 'type/DateTime' }],
      dimension_options: {
        '1': { name: 'Hour of day', mbql: ['temporal-bucket', null, 'hour-of-day'] },
        '2': { name: 'Day of week', mbql: ['temporal-bucket', null, 'day-of-week'] },
      },
    };

    const mockClient = createMockClientWithResponse('get', mockMetadata);

    const result = await getTableMetadataDefinition.handler(mockClient, { id: 7 });

    expectMcpContent(result, mockMetadata);
  });

  it('should handle empty fields list', async () => {
    const mockMetadata = {
      id: 15,
      name: 'empty_table',
      fields: [],
    };

    const mockClient = createMockClientWithResponse('get', mockMetadata);

    const result = await getTableMetadataDefinition.handler(mockClient, { id: 15 });

    expectMcpContent(result, mockMetadata);
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'Table not found');

    await expect(getTableMetadataDefinition.handler(mockClient, { id: 999 })).rejects.toThrow(
      'Table not found',
    );
    expect(mockClient.get).toHaveBeenCalledWith('/api/table/999/query_metadata', undefined);
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Forbidden', 403));

    await expect(getTableMetadataDefinition.handler(mockClient, { id: 1 })).rejects.toThrow(
      'Forbidden',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(getTableMetadataDefinition.name).toBe('get_table_metadata');
    expect(getTableMetadataDefinition.description).toBe(
      'Get table metadata including fields from Metabase',
    );
    expect(getTableMetadataDefinition.inputSchema).toEqual(GetTableMetadataParamsSchema);
  });
});
