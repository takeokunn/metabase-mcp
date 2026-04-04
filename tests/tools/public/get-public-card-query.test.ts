import { GetPublicCardQueryParamsSchema } from '@src/schemas/public';
import { getPublicCardQueryDefinition } from '@src/tools/public/get-public-card-query';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('getPublicCardQuery tool', () => {
  const input = { uuid: '550e8400-e29b-41d4-a716-446655440000' };

  it('should return formatted MCP response', async () => {
    const mockResult = { data: { rows: [[1, 'Alice']], cols: [{ name: 'id' }, { name: 'name' }] } };
    const mockClient = createMockClientWithResponse('get', mockResult);
    const result = await getPublicCardQueryDefinition.handler(mockClient, input);
    expectMcpContent(result, mockResult);
    expect(mockClient.get).toHaveBeenCalledWith(`/api/public/card/${input.uuid}/query`);
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'API error');
    await expect(getPublicCardQueryDefinition.handler(mockClient, input)).rejects.toThrow('API error');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Unauthorized', 401));
    await expect(getPublicCardQueryDefinition.handler(mockClient, input)).rejects.toThrow('Unauthorized');
  });

  it('should have correct tool definition metadata', () => {
    expect(getPublicCardQueryDefinition.name).toBe('get_public_card_query');
    expect(getPublicCardQueryDefinition.inputSchema).toEqual(GetPublicCardQueryParamsSchema);
  });
});
