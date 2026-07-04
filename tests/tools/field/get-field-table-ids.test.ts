import { GetFieldTableIdsInputSchema } from '@src/schemas/field';
import { getFieldTableIdsDefinition } from '@src/tools/field/get-field-table-ids';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('getFieldTableIds tool', () => {
  it('should return formatted MCP response', async () => {
    const mockClient = createMockClientWithResponse('post', { id: 1, name: 'Field 1' });
    const result = await getFieldTableIdsDefinition.handler(mockClient, { field_ids: [1, 2, 3] });
    expectMcpContent(result, { id: 1, name: 'Field 1' });
    expect(mockClient.post).toHaveBeenCalledWith('/api/field/table-ids', { field_ids: [1, 2, 3] });
    expect(mockClient.post).toHaveBeenCalledOnce();
  });
  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('post', 'Not found');
    await expect(
      getFieldTableIdsDefinition.handler(mockClient, { field_ids: [1, 2, 3] }),
    ).rejects.toThrow('Not found');
  });
  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('post', createApiError('Unauthorized', 401));
    await expect(
      getFieldTableIdsDefinition.handler(mockClient, { field_ids: [1, 2, 3] }),
    ).rejects.toThrow('Unauthorized');
  });
  it('should have correct tool definition metadata', () => {
    expect(getFieldTableIdsDefinition.name).toBe('get_field_table_ids');
    expect(getFieldTableIdsDefinition.description).toBe(
      'Get unique Table IDs for a list of Field IDs in Metabase',
    );
    expect(getFieldTableIdsDefinition.inputSchema).toEqual(GetFieldTableIdsInputSchema);
  });
});
