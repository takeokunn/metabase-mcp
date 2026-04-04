import { GetXrayEntityCellInputSchema } from '@src/schemas/automagic-dashboard';
import { getXrayEntityCellDefinition } from '@src/tools/automagic-dashboard/get-xray-entity-cell';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('getXrayEntityCell tool', () => {
  const input = { entity: 'table' as const, entity_id_or_query: '1', cell_query: 'col1' };

  it('should return formatted MCP response', async () => {
    const mockResult = { id: 'cell-xray', name: 'Cell X-ray' };
    const mockClient = createMockClientWithResponse('get', mockResult);
    const result = await getXrayEntityCellDefinition.handler(mockClient, input);
    expectMcpContent(result, mockResult);
    expect(mockClient.get).toHaveBeenCalledWith(
      '/api/automagic-dashboards/table/1/cell/col1',
    );
    expect(mockClient.get).toHaveBeenCalledOnce();
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'API error');
    await expect(getXrayEntityCellDefinition.handler(mockClient, input)).rejects.toThrow(
      'API error',
    );
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Not Found', 404));
    await expect(getXrayEntityCellDefinition.handler(mockClient, input)).rejects.toThrow(
      'Not Found',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(getXrayEntityCellDefinition.name).toBe('get_xray_entity_cell');
    expect(getXrayEntityCellDefinition.description).toBe(
      'Get an x-ray automagic dashboard for a specific cell of an entity in Metabase',
    );
    expect(getXrayEntityCellDefinition.inputSchema).toEqual(GetXrayEntityCellInputSchema);
  });
});
