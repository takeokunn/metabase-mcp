import { GetXrayEntityCellRuleCompareInputSchema } from '@src/schemas/automagic-dashboard';
import { getXrayEntityCellRuleCompareDefinition } from '@src/tools/automagic-dashboard/get-xray-entity-cell-rule-compare';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('getXrayEntityCellRuleCompare tool', () => {
  const input = {
    entity: 'table' as const,
    entity_id_or_query: '1',
    cell_query: 'col1',
    prefix: 'my-prefix',
    dashboard_template: 'my-template',
    comparison_entity: 'segment',
    comparison_entity_id_or_query: '2',
  };

  it('should return formatted MCP response', async () => {
    const mockResult = { id: 'cell-rule-compare', name: 'Cell Rule Compare X-ray' };
    const mockClient = createMockClientWithResponse('get', mockResult);
    const result = await getXrayEntityCellRuleCompareDefinition.handler(mockClient, input);
    expectMcpContent(result, mockResult);
    expect(mockClient.get).toHaveBeenCalledWith(
      '/api/automagic-dashboards/table/1/cell/col1/rule/my-prefix/my-template/compare/segment/2',
    );
    expect(mockClient.get).toHaveBeenCalledOnce();
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'API error');
    await expect(getXrayEntityCellRuleCompareDefinition.handler(mockClient, input)).rejects.toThrow(
      'API error',
    );
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Not Found', 404));
    await expect(getXrayEntityCellRuleCompareDefinition.handler(mockClient, input)).rejects.toThrow(
      'Not Found',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(getXrayEntityCellRuleCompareDefinition.name).toBe('get_xray_entity_cell_rule_compare');
    expect(getXrayEntityCellRuleCompareDefinition.description).toBe(
      'Get a comparison x-ray automagic dashboard for a specific cell of an entity with a rule applied in Metabase',
    );
    expect(getXrayEntityCellRuleCompareDefinition.inputSchema).toEqual(
      GetXrayEntityCellRuleCompareInputSchema,
    );
  });
});
