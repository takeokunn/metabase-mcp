import { deleteDatabaseDefinition } from '@src/tools/database/delete-database';
import { describe, expect, it } from 'vitest';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('deleteDatabase tool', () => {
  it('should delete a database and return formatted MCP response', async () => {
    const mockResponse = { success: true };

    const mockClient = createMockClientWithResponse('delete', mockResponse);

    const input = { id: 1 };

    const result = await deleteDatabaseDefinition.handler(mockClient, input);

    expectMcpContent(result, mockResponse);
    expect(mockClient.delete).toHaveBeenCalledWith('/api/database/1');
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('delete', 'Database not found');

    const input = { id: 999 };

    await expect(deleteDatabaseDefinition.handler(mockClient, input)).rejects.toThrow(
      'Database not found',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(deleteDatabaseDefinition.name).toBe('delete_database');
    expect(deleteDatabaseDefinition.description).toBe('Delete a database connection from Metabase');
    expect(deleteDatabaseDefinition.inputSchema).toBeDefined();
  });
});
