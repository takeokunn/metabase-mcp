import { UpdateGlossaryEntryInputSchema } from '@src/schemas/glossary';
import { updateGlossaryEntryDefinition } from '@src/tools/glossary/update-glossary-entry';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('updateGlossaryEntry tool', () => {
  it('should return formatted MCP response', async () => {
    const mockResult = { id: 1, name: 'Revenue', definition: 'Updated definition' };
    const mockClient = createMockClientWithResponse('put', mockResult);
    const result = await updateGlossaryEntryDefinition.handler(mockClient, {
      id: 1,
      definition: 'Updated definition',
    });
    expectMcpContent(result, mockResult);
    expect(mockClient.put).toHaveBeenCalledWith('/api/glossary/1', {
      name: undefined,
      definition: 'Updated definition',
      synonyms: undefined,
    });
  });

  it('should update all fields', async () => {
    const mockResult = { id: 1, name: 'New Name', definition: 'New Definition' };
    const mockClient = createMockClientWithResponse('put', mockResult);
    const result = await updateGlossaryEntryDefinition.handler(mockClient, {
      id: 1,
      name: 'New Name',
      definition: 'New Definition',
      synonyms: ['alias'],
    });
    expectMcpContent(result, mockResult);
    expect(mockClient.put).toHaveBeenCalledWith('/api/glossary/1', {
      name: 'New Name',
      definition: 'New Definition',
      synonyms: ['alias'],
    });
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('put', 'API error');
    await expect(updateGlossaryEntryDefinition.handler(mockClient, { id: 1 })).rejects.toThrow('API error');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('put', createApiError('Unauthorized', 401));
    await expect(updateGlossaryEntryDefinition.handler(mockClient, { id: 1 })).rejects.toThrow('Unauthorized');
  });

  it('should have correct metadata', () => {
    expect(updateGlossaryEntryDefinition.name).toBe('update_glossary_entry');
    expect(updateGlossaryEntryDefinition.inputSchema).toEqual(UpdateGlossaryEntryInputSchema);
  });
});
