import { GetMeasureInputSchema } from '@src/schemas/measure';
import { getMeasureDefinition } from '@src/tools/measure/get-measure';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('getMeasure tool', () => {
  it('should return formatted MCP response', async () => {
    const mockClient = createMockClientWithResponse('get', { id: 1, name: 'Measure 1' });
    const result = await getMeasureDefinition.handler(mockClient, { id: 1 });
    expectMcpContent(result, { id: 1, name: 'Measure 1' });
    expect(mockClient.get).toHaveBeenCalledWith('/api/measure/1');
    expect(mockClient.get).toHaveBeenCalledOnce();
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'Not found');
    await expect(getMeasureDefinition.handler(mockClient, { id: 999 })).rejects.toThrow('Not found');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Unauthorized', 401));
    await expect(getMeasureDefinition.handler(mockClient, { id: 1 })).rejects.toThrow('Unauthorized');
  });

  it('should have correct tool definition metadata', () => {
    expect(getMeasureDefinition.name).toBe('get_measure');
    expect(getMeasureDefinition.description).toBe('Get a measure by ID in Metabase');
    expect(getMeasureDefinition.inputSchema).toEqual(GetMeasureInputSchema);
  });
});
