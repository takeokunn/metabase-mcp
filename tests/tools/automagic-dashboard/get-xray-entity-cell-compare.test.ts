import { GetXrayEntityCellCompareInputSchema } from '@src/schemas/automagic-dashboard';
import { getXrayEntityCellCompareDefinition } from '@src/tools/automagic-dashboard/get-xray-entity-cell-compare';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('getXrayEntityCellCompare tool', () => {
  const input = {
    entity: 'table' as const,
    entity_id_or_query: '1',
    cell_query: 'col1',
    comparison_entity: 'segment',
    comparison_entity_id_or_query: '2',
  };

  it('should return formatted MCP response', async () => {
    const mockResult = { id: 'cell-compare', name: 'Cell Compare X-ray' };
    const mockClient = createMockClientWithResponse('get', mockResult);
    const result = await getXrayEntityCellCompareDefinition.handler(mockClient, input);
    expectMcpContent(result, mockResult);
    expect(mockClient.get).toHaveBeenCalledWith(
      '/api/automagic-dashboards/table/1/cell/col1/compare/segment/2',
    );
    expect(mockClient.get).toHaveBeenCalledOnce();
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'API error');
    await expect(
      getXrayEntityCellCompareDefinition.handler(mockClient, input),
    ).rejects.toThrow('API error');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Not Found', 404));
    await expect(
      getXrayEntityCellCompareDefinition.handler(mockClient, input),
    ).rejects.toThrow('Not Found');
  });

  it('should have correct tool definition metadata', () => {
    expect(getXrayEntityCellCompareDefinition.name).toBe('get_xray_entity_cell_compare');
    expect(getXrayEntityCellCompareDefinition.description).toBe(
      'Get a comparison x-ray automagic dashboard for a specific cell of an entity in Metabase',
    );
    expect(getXrayEntityCellCompareDefinition.inputSchema).toEqual(
      GetXrayEntityCellCompareInputSchema,
    );
  });
});
