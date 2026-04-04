import { createSampleDatabaseDefinition } from '@src/tools/database/create-sample-database';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('createSampleDatabase tool', () => {
  it('should create sample database and return formatted MCP response', async () => {
    const mockResponse = { id: 1, name: 'Sample Dataset', engine: 'h2' };

    const mockClient = createMockClientWithResponse('post', mockResponse);

    const result = await createSampleDatabaseDefinition.handler(mockClient, {});

    expectMcpContent(result, mockResponse);
    expect(mockClient.post).toHaveBeenCalledWith('/api/database/sample_database');
    expect(mockClient.post).toHaveBeenCalledOnce();
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('post', 'Sample DB already exists');

    await expect(createSampleDatabaseDefinition.handler(mockClient, {})).rejects.toThrow(
      'Sample DB already exists',
    );
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('post', createApiError('Unauthorized', 401));

    await expect(createSampleDatabaseDefinition.handler(mockClient, {})).rejects.toThrow(
      'Unauthorized',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(createSampleDatabaseDefinition.name).toBe('create_sample_database');
    expect(createSampleDatabaseDefinition.description).toBe(
      'Create the built-in sample database in Metabase',
    );
    expect(createSampleDatabaseDefinition.inputSchema).toEqual({});
  });
});
