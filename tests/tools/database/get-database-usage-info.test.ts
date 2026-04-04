import { GetDatabaseParamsSchema } from '@src/schemas/database';
import { getDatabaseUsageInfoDefinition } from '@src/tools/database/get-database-usage-info';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('getDatabaseUsageInfo tool', () => {
  it('should return formatted MCP response with usage info', async () => {
    const mockUsage = { question: 10, dataset: 2, metric: 1, segment: 0 };

    const mockClient = createMockClientWithResponse('get', mockUsage);

    const result = await getDatabaseUsageInfoDefinition.handler(mockClient, { id: 1 });

    expectMcpContent(result, mockUsage);
    expect(mockClient.get).toHaveBeenCalledWith('/api/database/1/usage_info');
    expect(mockClient.get).toHaveBeenCalledOnce();
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'Database not found');

    await expect(getDatabaseUsageInfoDefinition.handler(mockClient, { id: 999 })).rejects.toThrow(
      'Database not found',
    );
    expect(mockClient.get).toHaveBeenCalledWith('/api/database/999/usage_info');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Unauthorized', 401));

    await expect(getDatabaseUsageInfoDefinition.handler(mockClient, { id: 1 })).rejects.toThrow(
      'Unauthorized',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(getDatabaseUsageInfoDefinition.name).toBe('get_database_usage_info');
    expect(getDatabaseUsageInfoDefinition.description).toBe(
      'Get usage information for a database in Metabase',
    );
    expect(getDatabaseUsageInfoDefinition.inputSchema).toEqual(GetDatabaseParamsSchema);
  });
});
