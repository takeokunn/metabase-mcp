import { ValidateDatabaseInputSchema } from '@src/schemas/database';
import { validateDatabaseDefinition } from '@src/tools/database/validate-database';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('validateDatabase tool', () => {
  it('should validate database connection and return formatted MCP response', async () => {
    const mockResponse = { valid: true };

    const mockClient = createMockClientWithResponse('post', mockResponse);

    const input = { engine: 'postgres', details: { host: 'localhost', port: 5432 } };
    const result = await validateDatabaseDefinition.handler(mockClient, input);

    expectMcpContent(result, mockResponse);
    expect(mockClient.post).toHaveBeenCalledWith('/api/database/validate', {
      details: { engine: 'postgres', details: { host: 'localhost', port: 5432 } },
    });
    expect(mockClient.post).toHaveBeenCalledOnce();
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('post', 'Connection failed');

    await expect(
      validateDatabaseDefinition.handler(mockClient, { engine: 'postgres', details: {} }),
    ).rejects.toThrow('Connection failed');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('post', createApiError('Unauthorized', 401));

    await expect(
      validateDatabaseDefinition.handler(mockClient, { engine: 'postgres', details: {} }),
    ).rejects.toThrow('Unauthorized');
  });

  it('should have correct tool definition metadata', () => {
    expect(validateDatabaseDefinition.name).toBe('validate_database');
    expect(validateDatabaseDefinition.description).toBe(
      'Validate a database connection configuration before creating it in Metabase',
    );
    expect(validateDatabaseDefinition.inputSchema).toEqual(ValidateDatabaseInputSchema);
  });
});
