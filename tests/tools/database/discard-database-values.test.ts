import { discardDatabaseValuesDefinition } from '@src/tools/database/discard-database-values';
import { describe, expect, it } from 'vitest';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('discardDatabaseValues tool', () => {
  it('should discard values and return formatted MCP response', async () => {
    const mockResponse = { success: true };

    const mockClient = createMockClientWithResponse('post', mockResponse);

    const input = { id: 1 };

    const result = await discardDatabaseValuesDefinition.handler(mockClient, input);

    expectMcpContent(result, mockResponse);
    expect(mockClient.post).toHaveBeenCalledWith('/api/database/1/discard_values');
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('post', 'Database not found');

    const input = { id: 999 };

    await expect(discardDatabaseValuesDefinition.handler(mockClient, input)).rejects.toThrow(
      'Database not found',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(discardDatabaseValuesDefinition.name).toBe('discard_database_values');
    expect(discardDatabaseValuesDefinition.description).toBe(
      'Discard cached field values for a database in Metabase',
    );
    expect(discardDatabaseValuesDefinition.inputSchema).toBeDefined();
  });
});
