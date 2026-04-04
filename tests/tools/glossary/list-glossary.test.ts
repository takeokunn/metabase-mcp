import { listGlossaryDefinition } from '@src/tools/glossary/list-glossary';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('listGlossary tool', () => {
  it('should return formatted MCP response', async () => {
    const mockResult = [{ id: 1, name: 'Revenue', definition: 'Total income from sales' }];
    const mockClient = createMockClientWithResponse('get', mockResult);
    const result = await listGlossaryDefinition.handler(mockClient);
    expectMcpContent(result, mockResult);
    expect(mockClient.get).toHaveBeenCalledWith('/api/glossary');
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'API error');
    await expect(listGlossaryDefinition.handler(mockClient)).rejects.toThrow('API error');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Unauthorized', 401));
    await expect(listGlossaryDefinition.handler(mockClient)).rejects.toThrow('Unauthorized');
  });

  it('should have correct metadata', () => {
    expect(listGlossaryDefinition.name).toBe('list_glossary');
    expect(listGlossaryDefinition.inputSchema).toEqual({});
  });
});
