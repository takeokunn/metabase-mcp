import { ListMeasuresInputSchema } from '@src/schemas/measure';
import { listMeasuresDefinition } from '@src/tools/measure/list-measures';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('listMeasures tool', () => {
  it('should return formatted MCP response', async () => {
    const mockClient = createMockClientWithResponse('get', [{ id: 1, name: 'Measure 1' }]);
    const result = await listMeasuresDefinition.handler(mockClient, {});
    expectMcpContent(result, [{ id: 1, name: 'Measure 1' }]);
    expect(mockClient.get).toHaveBeenCalledWith('/api/measure');
    expect(mockClient.get).toHaveBeenCalledOnce();
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'Not found');
    await expect(listMeasuresDefinition.handler(mockClient, {})).rejects.toThrow('Not found');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Unauthorized', 401));
    await expect(listMeasuresDefinition.handler(mockClient, {})).rejects.toThrow('Unauthorized');
  });

  it('should have correct tool definition metadata', () => {
    expect(listMeasuresDefinition.name).toBe('list_measures');
    expect(listMeasuresDefinition.description).toBe('List all measures in Metabase');
    expect(listMeasuresDefinition.inputSchema).toEqual(ListMeasuresInputSchema);
  });
});
