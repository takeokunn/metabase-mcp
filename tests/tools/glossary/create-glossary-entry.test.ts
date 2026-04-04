import { CreateGlossaryEntryInputSchema } from '@src/schemas/glossary';
import { createGlossaryEntryDefinition } from '@src/tools/glossary/create-glossary-entry';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('createGlossaryEntry tool', () => {
  it('should return formatted MCP response', async () => {
    const mockResult = { id: 1, name: 'Revenue', definition: 'Total income from sales' };
    const mockClient = createMockClientWithResponse('post', mockResult);
    const result = await createGlossaryEntryDefinition.handler(mockClient, {
      name: 'Revenue',
      definition: 'Total income from sales',
    });
    expectMcpContent(result, mockResult);
    expect(mockClient.post).toHaveBeenCalledWith('/api/glossary', {
      name: 'Revenue',
      definition: 'Total income from sales',
      synonyms: undefined,
      collection_id: undefined,
    });
  });

  it('should create entry with synonyms and collection_id', async () => {
    const mockResult = { id: 2, name: 'MRR', definition: 'Monthly Recurring Revenue' };
    const mockClient = createMockClientWithResponse('post', mockResult);
    const result = await createGlossaryEntryDefinition.handler(mockClient, {
      name: 'MRR',
      definition: 'Monthly Recurring Revenue',
      synonyms: ['Monthly Revenue'],
      collection_id: 10,
    });
    expectMcpContent(result, mockResult);
    expect(mockClient.post).toHaveBeenCalledWith('/api/glossary', {
      name: 'MRR',
      definition: 'Monthly Recurring Revenue',
      synonyms: ['Monthly Revenue'],
      collection_id: 10,
    });
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('post', 'API error');
    await expect(
      createGlossaryEntryDefinition.handler(mockClient, { name: 'Test', definition: 'A test' }),
    ).rejects.toThrow('API error');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('post', createApiError('Unauthorized', 401));
    await expect(
      createGlossaryEntryDefinition.handler(mockClient, { name: 'Test', definition: 'A test' }),
    ).rejects.toThrow('Unauthorized');
  });

  it('should have correct metadata', () => {
    expect(createGlossaryEntryDefinition.name).toBe('create_glossary_entry');
    expect(createGlossaryEntryDefinition.inputSchema).toEqual(CreateGlossaryEntryInputSchema);
  });
});
