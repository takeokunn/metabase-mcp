import { generateSqlDefinition } from '@src/tools/llm/generate-sql';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('generateSql tool', () => {
  const input = { question: 'How many orders last month?', database_id: 1 };

  it('should return formatted MCP response', async () => {
    const mockResult = { sql: 'SELECT COUNT(*) FROM orders WHERE ...' };
    const mockClient = createMockClientWithResponse('post', mockResult);
    const result = await generateSqlDefinition.handler(mockClient, input);
    expectMcpContent(result, mockResult);
  });

  it('should have EE annotation in description', () => {
    expect(generateSqlDefinition.description).toContain('[Requires Metabase Pro]');
  });

  it('should call correct endpoint', async () => {
    const mockClient = createMockClientWithResponse('post', {});
    await generateSqlDefinition.handler(mockClient, input);
    expect(mockClient.post).toHaveBeenCalledWith('/api/llm/generate-sql', {
      question: input.question,
      database_id: input.database_id,
    });
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('post', 'API error');
    await expect(generateSqlDefinition.handler(mockClient, input)).rejects.toThrow('API error');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('post', createApiError('Unauthorized', 401));
    await expect(generateSqlDefinition.handler(mockClient, input)).rejects.toThrow('Unauthorized');
  });
});
