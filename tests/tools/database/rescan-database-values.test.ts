import { rescanDatabaseValuesDefinition } from '@src/tools/database/rescan-database-values';
import { describe, expect, it } from 'vitest';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('rescanDatabaseValues tool', () => {
  it('should trigger rescan and return formatted MCP response', async () => {
    const mockResponse = { success: true };

    const mockClient = createMockClientWithResponse('post', mockResponse);

    const input = { id: 1 };

    const result = await rescanDatabaseValuesDefinition.handler(mockClient, input);

    expectMcpContent(result, mockResponse);
    expect(mockClient.post).toHaveBeenCalledWith('/api/database/1/rescan_values');
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('post', 'Database not found');

    const input = { id: 999 };

    await expect(rescanDatabaseValuesDefinition.handler(mockClient, input)).rejects.toThrow(
      'Database not found',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(rescanDatabaseValuesDefinition.name).toBe('rescan_database_values');
    expect(rescanDatabaseValuesDefinition.description).toBe(
      'Rescan field values for a database in Metabase',
    );
    expect(rescanDatabaseValuesDefinition.inputSchema).toBeDefined();
  });
});
