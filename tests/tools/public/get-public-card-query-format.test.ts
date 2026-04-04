import { GetPublicCardQueryFormatParamsSchema } from '@src/schemas/public';
import { getPublicCardQueryFormatDefinition } from '@src/tools/public/get-public-card-query-format';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('getPublicCardQueryFormat tool', () => {
  const input = { uuid: '550e8400-e29b-41d4-a716-446655440000', export_format: 'csv' as const };

  it('should return formatted MCP response', async () => {
    const mockResult = 'id,name\n1,Alice\n';
    const mockClient = createMockClientWithResponse('get', mockResult);
    const result = await getPublicCardQueryFormatDefinition.handler(mockClient, input);
    expectMcpContent(result, mockResult);
    expect(mockClient.get).toHaveBeenCalledWith(
      `/api/public/card/${input.uuid}/query/${input.export_format}`,
    );
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'API error');
    await expect(getPublicCardQueryFormatDefinition.handler(mockClient, input)).rejects.toThrow(
      'API error',
    );
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Forbidden', 403));
    await expect(getPublicCardQueryFormatDefinition.handler(mockClient, input)).rejects.toThrow(
      'Forbidden',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(getPublicCardQueryFormatDefinition.name).toBe('get_public_card_query_format');
    expect(getPublicCardQueryFormatDefinition.inputSchema).toEqual(
      GetPublicCardQueryFormatParamsSchema,
    );
  });
});
