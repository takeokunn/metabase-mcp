import { BulkUpdateTablesInputSchema } from '@src/schemas/table';
import { bulkUpdateTablesDefinition } from '@src/tools/table/bulk-update-tables';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('bulkUpdateTables tool', () => {
  it('should return formatted MCP response after bulk updating tables', async () => {
    const mockResult = [
      { id: 1, display_name: 'Updated Orders', description: 'Order data' },
      { id: 2, display_name: 'Updated Products', description: null },
    ];

    const mockClient = createMockClientWithResponse('put', mockResult);

    const tables = [
      { id: 1, display_name: 'Updated Orders', description: 'Order data' },
      { id: 2, display_name: 'Updated Products' },
    ];

    const result = await bulkUpdateTablesDefinition.handler(mockClient, { tables });

    expectMcpContent(result, mockResult);
    expect(mockClient.put).toHaveBeenCalledWith('/api/table', tables);
    expect(mockClient.put).toHaveBeenCalledOnce();
  });

  it('should bulk update a single table', async () => {
    const mockResult = [{ id: 5, display_name: 'New Name' }];
    const mockClient = createMockClientWithResponse('put', mockResult);

    const tables = [{ id: 5, display_name: 'New Name' }];

    await bulkUpdateTablesDefinition.handler(mockClient, { tables });

    expect(mockClient.put).toHaveBeenCalledWith('/api/table', tables);
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('put', 'API error');

    await expect(
      bulkUpdateTablesDefinition.handler(mockClient, { tables: [{ id: 1 }] }),
    ).rejects.toThrow('API error');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('put', createApiError('Forbidden', 403));

    await expect(
      bulkUpdateTablesDefinition.handler(mockClient, { tables: [{ id: 1 }] }),
    ).rejects.toThrow('Forbidden');
  });

  it('should have correct tool definition metadata', () => {
    expect(bulkUpdateTablesDefinition.name).toBe('bulk_update_tables');
    expect(bulkUpdateTablesDefinition.description).toBe('Bulk update multiple tables in Metabase');
    expect(bulkUpdateTablesDefinition.inputSchema).toEqual(BulkUpdateTablesInputSchema);
  });
});
