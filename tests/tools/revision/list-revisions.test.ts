import { ListRevisionsParamsSchema } from '@src/schemas/revision';
import { listRevisionsDefinition } from '@src/tools/revision/list-revisions';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('listRevisions tool', () => {
  it('should list all revisions when no filters provided', async () => {
    const mockRevisions = [
      { id: 1, entity: 'dashboard', entity_id: 5, description: 'Updated layout' },
      { id: 2, entity: 'card', entity_id: 10, description: 'Changed query' },
    ];
    const mockClient = createMockClientWithResponse('get', mockRevisions);

    const result = await listRevisionsDefinition.handler(mockClient, {});

    expectMcpContent(result, mockRevisions);
    expect(mockClient.get).toHaveBeenCalledWith('/api/revision');
    expect(mockClient.get).toHaveBeenCalledOnce();
  });

  it('should filter by entity type and id', async () => {
    const mockRevisions = [{ id: 3, entity: 'dashboard', entity_id: 5 }];
    const mockClient = createMockClientWithResponse('get', mockRevisions);

    const result = await listRevisionsDefinition.handler(mockClient, {
      entity: 'dashboard',
      id: 5,
    });

    expectMcpContent(result, mockRevisions);
    expect(mockClient.get).toHaveBeenCalledWith('/api/revision?entity=dashboard&id=5');
  });

  it('should filter by entity type only', async () => {
    const mockClient = createMockClientWithResponse('get', []);

    await listRevisionsDefinition.handler(mockClient, { entity: 'card' });

    expect(mockClient.get).toHaveBeenCalledWith('/api/revision?entity=card');
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'API error');

    await expect(listRevisionsDefinition.handler(mockClient, {})).rejects.toThrow('API error');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Unauthorized', 401));

    await expect(listRevisionsDefinition.handler(mockClient, {})).rejects.toThrow('Unauthorized');
  });

  it('should have correct tool definition metadata', () => {
    expect(listRevisionsDefinition.name).toBe('list_revisions');
    expect(listRevisionsDefinition.inputSchema).toEqual(ListRevisionsParamsSchema);
  });
});
