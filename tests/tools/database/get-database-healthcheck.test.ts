import { GetDatabaseParamsSchema } from '@src/schemas/database';
import { getDatabaseHealthcheckDefinition } from '@src/tools/database/get-database-healthcheck';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('getDatabaseHealthcheck tool', () => {
  it('should return formatted MCP response with healthcheck result', async () => {
    const mockResult = { status: 'ok' };

    const mockClient = createMockClientWithResponse('get', mockResult);

    const result = await getDatabaseHealthcheckDefinition.handler(mockClient, { id: 1 });

    expectMcpContent(result, mockResult);
    expect(mockClient.get).toHaveBeenCalledWith('/api/database/1/healthcheck');
    expect(mockClient.get).toHaveBeenCalledOnce();
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'Database not found');

    await expect(getDatabaseHealthcheckDefinition.handler(mockClient, { id: 999 })).rejects.toThrow(
      'Database not found',
    );
    expect(mockClient.get).toHaveBeenCalledWith('/api/database/999/healthcheck');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Unauthorized', 401));

    await expect(getDatabaseHealthcheckDefinition.handler(mockClient, { id: 1 })).rejects.toThrow(
      'Unauthorized',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(getDatabaseHealthcheckDefinition.name).toBe('get_database_healthcheck');
    expect(getDatabaseHealthcheckDefinition.description).toBe(
      'Perform a healthcheck on a database connection in Metabase',
    );
    expect(getDatabaseHealthcheckDefinition.inputSchema).toEqual(GetDatabaseParamsSchema);
  });
});
