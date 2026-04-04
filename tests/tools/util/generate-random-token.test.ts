import { GenerateRandomTokenInputSchema } from '@src/schemas/util';
import { generateRandomTokenDefinition } from '@src/tools/util/generate-random-token';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('generateRandomToken tool', () => {
  it('should return formatted MCP response', async () => {
    const mockResult = { token: 'abc123xyz' };
    const mockClient = createMockClientWithResponse('get', mockResult);
    const result = await generateRandomTokenDefinition.handler(mockClient, {});
    expectMcpContent(result, mockResult);
    expect(mockClient.get).toHaveBeenCalledWith('/api/util/random_token');
    expect(mockClient.get).toHaveBeenCalledOnce();
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'Not found');
    await expect(generateRandomTokenDefinition.handler(mockClient, {})).rejects.toThrow(
      'Not found',
    );
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Unauthorized', 401));
    await expect(generateRandomTokenDefinition.handler(mockClient, {})).rejects.toThrow(
      'Unauthorized',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(generateRandomTokenDefinition.name).toBe('generate_random_token');
    expect(generateRandomTokenDefinition.description).toBe('Generate a random token in Metabase');
    expect(generateRandomTokenDefinition.inputSchema).toEqual(GenerateRandomTokenInputSchema);
  });
});
