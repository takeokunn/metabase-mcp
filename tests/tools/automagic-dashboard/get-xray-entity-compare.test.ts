import { GetXrayEntityCompareInputSchema } from '@src/schemas/automagic-dashboard';
import { getXrayEntityCompareDefinition } from '@src/tools/automagic-dashboard/get-xray-entity-compare';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('getXrayEntityCompare tool', () => {
  const input = {
    entity: 'table' as const,
    entity_id_or_query: '1',
    comparison_entity: 'segment',
    comparison_entity_id_or_query: '2',
  };

  it('should return formatted MCP response', async () => {
    const mockResult = { id: 'entity-compare', name: 'Entity Compare X-ray' };
    const mockClient = createMockClientWithResponse('get', mockResult);
    const result = await getXrayEntityCompareDefinition.handler(mockClient, input);
    expectMcpContent(result, mockResult);
    expect(mockClient.get).toHaveBeenCalledWith(
      '/api/automagic-dashboards/table/1/compare/segment/2',
    );
    expect(mockClient.get).toHaveBeenCalledOnce();
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'API error');
    await expect(
      getXrayEntityCompareDefinition.handler(mockClient, input),
    ).rejects.toThrow('API error');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Not Found', 404));
    await expect(
      getXrayEntityCompareDefinition.handler(mockClient, input),
    ).rejects.toThrow('Not Found');
  });

  it('should have correct tool definition metadata', () => {
    expect(getXrayEntityCompareDefinition.name).toBe('get_xray_entity_compare');
    expect(getXrayEntityCompareDefinition.description).toBe(
      'Get a comparison x-ray automagic dashboard for an entity in Metabase',
    );
    expect(getXrayEntityCompareDefinition.inputSchema).toEqual(
      GetXrayEntityCompareInputSchema,
    );
  });
});
