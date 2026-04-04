import { RunPublicCardPivotQuerySchema } from '@src/schemas/public';
import { runPublicCardPivotQueryDefinition } from '@src/tools/public/run-public-card-pivot-query';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('runPublicCardPivotQuery tool', () => {
  const input = {
    uuid: '550e8400-e29b-41d4-a716-446655440000',
    parameters: [{ type: 'date', value: '2024' }],
  };

  it('should return formatted MCP response', async () => {
    const mockResult = { data: { rows: [] } };
    const mockClient = createMockClientWithResponse('get', mockResult);
    const result = await runPublicCardPivotQueryDefinition.handler(mockClient, input);
    expectMcpContent(result, mockResult);
    expect(mockClient.get).toHaveBeenCalledWith(`/api/public/pivot/card/${input.uuid}/query`, {
      parameters: input.parameters,
    });
  });

  it('should use empty array when parameters is undefined', async () => {
    const mockClient = createMockClientWithResponse('get', { data: { rows: [] } });
    await runPublicCardPivotQueryDefinition.handler(mockClient, { uuid: input.uuid });
    expect(mockClient.get).toHaveBeenCalledWith(`/api/public/pivot/card/${input.uuid}/query`, {
      parameters: [],
    });
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'API error');
    await expect(runPublicCardPivotQueryDefinition.handler(mockClient, input)).rejects.toThrow(
      'API error',
    );
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Not Found', 404));
    await expect(runPublicCardPivotQueryDefinition.handler(mockClient, input)).rejects.toThrow(
      'Not Found',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(runPublicCardPivotQueryDefinition.name).toBe('run_public_card_pivot_query');
    expect(runPublicCardPivotQueryDefinition.description).toBe(
      'Run a pivot query for a public card in Metabase',
    );
    expect(runPublicCardPivotQueryDefinition.inputSchema).toEqual(RunPublicCardPivotQuerySchema);
  });
});
