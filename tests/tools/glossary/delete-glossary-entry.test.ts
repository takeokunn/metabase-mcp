import { DeleteGlossaryEntryParamsSchema } from '@src/schemas/glossary';
import { deleteGlossaryEntryDefinition } from '@src/tools/glossary/delete-glossary-entry';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('deleteGlossaryEntry tool', () => {
  it('should return formatted MCP response', async () => {
    const mockResult = { success: true };
    const mockClient = createMockClientWithResponse('delete', mockResult);
    const result = await deleteGlossaryEntryDefinition.handler(mockClient, { id: 1 });
    expectMcpContent(result, mockResult);
    expect(mockClient.delete).toHaveBeenCalledWith('/api/glossary/1');
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('delete', 'API error');
    await expect(deleteGlossaryEntryDefinition.handler(mockClient, { id: 1 })).rejects.toThrow(
      'API error',
    );
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('delete', createApiError('Unauthorized', 401));
    await expect(deleteGlossaryEntryDefinition.handler(mockClient, { id: 1 })).rejects.toThrow(
      'Unauthorized',
    );
  });

  it('should have correct metadata', () => {
    expect(deleteGlossaryEntryDefinition.name).toBe('delete_glossary_entry');
    expect(deleteGlossaryEntryDefinition.inputSchema).toEqual(DeleteGlossaryEntryParamsSchema);
  });
});
