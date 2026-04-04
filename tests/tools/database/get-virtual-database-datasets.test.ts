import { GetVirtualDatabaseDatasetsParamsSchema } from '@src/schemas/database';
import { getVirtualDatabaseDatasetsDefinition } from '@src/tools/database/get-virtual-database-datasets';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('getVirtualDatabaseDatasets tool', () => {
  it('should return formatted MCP response', async () => {
    const mockResponse = [{ id: 1, name: 'Dataset 1' }];
    const mockClient = createMockClientWithResponse('get', mockResponse);
    const result = await getVirtualDatabaseDatasetsDefinition.handler(mockClient, { virtual_db: 5 });
    expectMcpContent(result, mockResponse);
    expect(mockClient.get).toHaveBeenCalledWith('/api/database/5/datasets');
    expect(mockClient.get).toHaveBeenCalledOnce();
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'Not found');
    await expect(getVirtualDatabaseDatasetsDefinition.handler(mockClient, { virtual_db: 999 })).rejects.toThrow('Not found');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Unauthorized', 401));
    await expect(getVirtualDatabaseDatasetsDefinition.handler(mockClient, { virtual_db: 1 })).rejects.toThrow('Unauthorized');
  });

  it('should have correct tool definition metadata', () => {
    expect(getVirtualDatabaseDatasetsDefinition.name).toBe('get_virtual_database_datasets');
    expect(getVirtualDatabaseDatasetsDefinition.description).toBe('Get datasets for a virtual database in Metabase');
    expect(getVirtualDatabaseDatasetsDefinition.inputSchema).toEqual(GetVirtualDatabaseDatasetsParamsSchema);
  });
});
