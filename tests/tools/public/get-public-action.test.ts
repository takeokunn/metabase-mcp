import { GetPublicActionSchema } from '@src/schemas/public';
import { getPublicActionDefinition } from '@src/tools/public/get-public-action';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('getPublicAction tool', () => {
  const input = { uuid: '550e8400-e29b-41d4-a716-446655440000' };

  it('should return formatted MCP response', async () => {
    const mockResult = { id: 1, name: 'Test Action' };
    const mockClient = createMockClientWithResponse('get', mockResult);
    const result = await getPublicActionDefinition.handler(mockClient, input);
    expectMcpContent(result, mockResult);
    expect(mockClient.get).toHaveBeenCalledWith(`/api/public/action/${input.uuid}`);
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'API error');
    await expect(getPublicActionDefinition.handler(mockClient, input)).rejects.toThrow('API error');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Not Found', 404));
    await expect(getPublicActionDefinition.handler(mockClient, input)).rejects.toThrow('Not Found');
  });

  it('should have correct tool definition metadata', () => {
    expect(getPublicActionDefinition.name).toBe('get_public_action');
    expect(getPublicActionDefinition.description).toBe(
      'Get details of a public action in Metabase',
    );
    expect(getPublicActionDefinition.inputSchema).toEqual(GetPublicActionSchema);
  });
});
