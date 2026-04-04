import { GetXrayEntityRuleCompareInputSchema } from '@src/schemas/automagic-dashboard';
import { getXrayEntityRuleCompareDefinition } from '@src/tools/automagic-dashboard/get-xray-entity-rule-compare';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('getXrayEntityRuleCompare tool', () => {
  const input = {
    entity: 'table' as const,
    entity_id_or_query: '1',
    prefix: 'my-prefix',
    dashboard_template: 'my-template',
    comparison_entity: 'segment',
    comparison_entity_id_or_query: '2',
  };

  it('should return formatted MCP response', async () => {
    const mockResult = { id: 'entity-rule-compare', name: 'Entity Rule Compare X-ray' };
    const mockClient = createMockClientWithResponse('get', mockResult);
    const result = await getXrayEntityRuleCompareDefinition.handler(mockClient, input);
    expectMcpContent(result, mockResult);
    expect(mockClient.get).toHaveBeenCalledWith(
      '/api/automagic-dashboards/table/1/rule/my-prefix/my-template/compare/segment/2',
    );
    expect(mockClient.get).toHaveBeenCalledOnce();
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'API error');
    await expect(getXrayEntityRuleCompareDefinition.handler(mockClient, input)).rejects.toThrow(
      'API error',
    );
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Not Found', 404));
    await expect(getXrayEntityRuleCompareDefinition.handler(mockClient, input)).rejects.toThrow(
      'Not Found',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(getXrayEntityRuleCompareDefinition.name).toBe('get_xray_entity_rule_compare');
    expect(getXrayEntityRuleCompareDefinition.description).toBe(
      'Get a comparison x-ray automagic dashboard for an entity with a rule applied in Metabase',
    );
    expect(getXrayEntityRuleCompareDefinition.inputSchema).toEqual(
      GetXrayEntityRuleCompareInputSchema,
    );
  });
});
