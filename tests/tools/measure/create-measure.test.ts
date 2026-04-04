import { CreateMeasureInputSchema } from '@src/schemas/measure';
import { createMeasureDefinition } from '@src/tools/measure/create-measure';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('createMeasure tool', () => {
  it('should return formatted MCP response', async () => {
    const definition = { type: 'count' };
    const mockClient = createMockClientWithResponse('post', { id: 1, name: 'New Measure' });
    const result = await createMeasureDefinition.handler(mockClient, {
      name: 'New Measure',
      definition,
    });
    expectMcpContent(result, { id: 1, name: 'New Measure' });
    expect(mockClient.post).toHaveBeenCalledWith('/api/measure', {
      name: 'New Measure',
      definition,
    });
    expect(mockClient.post).toHaveBeenCalledOnce();
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('post', 'Not found');
    await expect(
      createMeasureDefinition.handler(mockClient, { name: 'M', definition: {} }),
    ).rejects.toThrow('Not found');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('post', createApiError('Unauthorized', 401));
    await expect(
      createMeasureDefinition.handler(mockClient, { name: 'M', definition: {} }),
    ).rejects.toThrow('Unauthorized');
  });

  it('should have correct tool definition metadata', () => {
    expect(createMeasureDefinition.name).toBe('create_measure');
    expect(createMeasureDefinition.description).toBe('Create a new measure in Metabase');
    expect(createMeasureDefinition.inputSchema).toEqual(CreateMeasureInputSchema);
  });
});
