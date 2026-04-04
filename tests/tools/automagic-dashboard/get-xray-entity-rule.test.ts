import { GetXrayEntityRuleInputSchema } from '@src/schemas/automagic-dashboard';
import { getXrayEntityRuleDefinition } from '@src/tools/automagic-dashboard/get-xray-entity-rule';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('getXrayEntityRule tool', () => {
  const input = {
    entity: 'table' as const,
    entity_id_or_query: '1',
    prefix: 'my-prefix',
    dashboard_template: 'my-template',
  };

  it('should return formatted MCP response', async () => {
    const mockResult = { id: 'entity-rule', name: 'Entity Rule X-ray' };
    const mockClient = createMockClientWithResponse('get', mockResult);
    const result = await getXrayEntityRuleDefinition.handler(mockClient, input);
    expectMcpContent(result, mockResult);
    expect(mockClient.get).toHaveBeenCalledWith(
      '/api/automagic-dashboards/table/1/rule/my-prefix/my-template',
    );
    expect(mockClient.get).toHaveBeenCalledOnce();
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'API error');
    await expect(getXrayEntityRuleDefinition.handler(mockClient, input)).rejects.toThrow(
      'API error',
    );
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Not Found', 404));
    await expect(getXrayEntityRuleDefinition.handler(mockClient, input)).rejects.toThrow(
      'Not Found',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(getXrayEntityRuleDefinition.name).toBe('get_xray_entity_rule');
    expect(getXrayEntityRuleDefinition.description).toBe(
      'Get an x-ray automagic dashboard for an entity with a rule applied in Metabase',
    );
    expect(getXrayEntityRuleDefinition.inputSchema).toEqual(GetXrayEntityRuleInputSchema);
  });
});
