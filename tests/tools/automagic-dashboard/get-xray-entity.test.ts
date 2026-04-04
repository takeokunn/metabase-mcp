import { GetXrayEntityInputSchema } from '@src/schemas/automagic-dashboard';
import { getXrayEntityDefinition } from '@src/tools/automagic-dashboard/get-xray-entity';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('getXrayEntity tool', () => {
  it('should return formatted MCP response for a table entity', async () => {
    const mockResult = { id: 'automagic-dashboards/table/1', name: 'Table X-ray' };
    const mockClient = createMockClientWithResponse('get', mockResult);
    const result = await getXrayEntityDefinition.handler(mockClient, {
      entity: 'table',
      entity_id: 1,
    });
    expectMcpContent(result, mockResult);
    expect(mockClient.get).toHaveBeenCalledWith('/api/automagic-dashboards/table/1');
    expect(mockClient.get).toHaveBeenCalledOnce();
  });

  it('should return formatted MCP response for a field entity', async () => {
    const mockClient = createMockClientWithResponse('get', { name: 'Field X-ray' });
    await getXrayEntityDefinition.handler(mockClient, { entity: 'field', entity_id: 42 });
    expect(mockClient.get).toHaveBeenCalledWith('/api/automagic-dashboards/field/42');
  });

  it('should return formatted MCP response for a metric entity', async () => {
    const mockClient = createMockClientWithResponse('get', { name: 'Metric X-ray' });
    await getXrayEntityDefinition.handler(mockClient, { entity: 'metric', entity_id: 7 });
    expect(mockClient.get).toHaveBeenCalledWith('/api/automagic-dashboards/metric/7');
  });

  it('should support string entity_id', async () => {
    const mockClient = createMockClientWithResponse('get', { name: 'Question X-ray' });
    await getXrayEntityDefinition.handler(mockClient, {
      entity: 'question',
      entity_id: 'some-query',
    });
    expect(mockClient.get).toHaveBeenCalledWith('/api/automagic-dashboards/question/some-query');
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'API error');
    await expect(
      getXrayEntityDefinition.handler(mockClient, { entity: 'table', entity_id: 1 }),
    ).rejects.toThrow('API error');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Unauthorized', 401));
    await expect(
      getXrayEntityDefinition.handler(mockClient, { entity: 'table', entity_id: 1 }),
    ).rejects.toThrow('Unauthorized');
  });

  it('should have correct tool definition metadata', () => {
    expect(getXrayEntityDefinition.name).toBe('get_xray_entity');
    expect(getXrayEntityDefinition.description).toBe(
      'Get an x-ray automagic dashboard for any entity in Metabase',
    );
    expect(getXrayEntityDefinition.inputSchema).toEqual(GetXrayEntityInputSchema);
  });
});
