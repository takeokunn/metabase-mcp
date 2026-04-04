import { GetXrayEntityQueryMetadataInputSchema } from '@src/schemas/automagic-dashboard';
import { getXrayEntityQueryMetadataDefinition } from '@src/tools/automagic-dashboard/get-xray-entity-query-metadata';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('getXrayEntityQueryMetadata tool', () => {
  const input = { entity: 'table' as const, entity_id_or_query: '1' };

  it('should return formatted MCP response', async () => {
    const mockResult = { metadata: { columns: [] } };
    const mockClient = createMockClientWithResponse('get', mockResult);
    const result = await getXrayEntityQueryMetadataDefinition.handler(mockClient, input);
    expectMcpContent(result, mockResult);
    expect(mockClient.get).toHaveBeenCalledWith(
      '/api/automagic-dashboards/table/1/query_metadata',
    );
    expect(mockClient.get).toHaveBeenCalledOnce();
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'API error');
    await expect(
      getXrayEntityQueryMetadataDefinition.handler(mockClient, input),
    ).rejects.toThrow('API error');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Not Found', 404));
    await expect(
      getXrayEntityQueryMetadataDefinition.handler(mockClient, input),
    ).rejects.toThrow('Not Found');
  });

  it('should have correct tool definition metadata', () => {
    expect(getXrayEntityQueryMetadataDefinition.name).toBe('get_xray_entity_query_metadata');
    expect(getXrayEntityQueryMetadataDefinition.description).toBe(
      'Get query metadata for an x-ray automagic dashboard entity in Metabase',
    );
    expect(getXrayEntityQueryMetadataDefinition.inputSchema).toEqual(
      GetXrayEntityQueryMetadataInputSchema,
    );
  });
});
