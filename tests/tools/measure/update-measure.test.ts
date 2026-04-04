import { UpdateMeasureInputSchema } from '@src/schemas/measure';
import { updateMeasureDefinition } from '@src/tools/measure/update-measure';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('updateMeasure tool', () => {
  it('should return formatted MCP response', async () => {
    const mockClient = createMockClientWithResponse('put', { id: 1, name: 'Updated Measure' });
    const result = await updateMeasureDefinition.handler(mockClient, {
      id: 1,
      name: 'Updated Measure',
    });
    expectMcpContent(result, { id: 1, name: 'Updated Measure' });
    expect(mockClient.put).toHaveBeenCalledWith('/api/measure/1', {
      name: 'Updated Measure',
      definition: undefined,
    });
    expect(mockClient.put).toHaveBeenCalledOnce();
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('put', 'Not found');
    await expect(updateMeasureDefinition.handler(mockClient, { id: 999 })).rejects.toThrow(
      'Not found',
    );
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('put', createApiError('Unauthorized', 401));
    await expect(updateMeasureDefinition.handler(mockClient, { id: 1 })).rejects.toThrow(
      'Unauthorized',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(updateMeasureDefinition.name).toBe('update_measure');
    expect(updateMeasureDefinition.description).toBe('Update a measure by ID in Metabase');
    expect(updateMeasureDefinition.inputSchema).toEqual(UpdateMeasureInputSchema);
  });
});
