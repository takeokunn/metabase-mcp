import { GetPulsePreviewCardInputSchema } from '@src/schemas/pulse';
import { getPulsePreviewCardDefinition } from '@src/tools/pulse/get-pulse-preview-card';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('getPulsePreviewCard tool', () => {
  it('should return formatted MCP response with card preview', async () => {
    const mockPreview = {
      id: 1,
      name: 'Revenue Chart',
      data: { rows: [], cols: [] },
    };

    const mockClient = createMockClientWithResponse('get', mockPreview);

    const result = await getPulsePreviewCardDefinition.handler(mockClient, { id: 1 });

    expectMcpContent(result, mockPreview);
    expect(mockClient.get).toHaveBeenCalledWith('/api/pulse/preview_card/1');
    expect(mockClient.get).toHaveBeenCalledOnce();
  });

  it('should use the correct card ID in the URL', async () => {
    const mockPreview = { id: 42, name: 'Chart' };

    const mockClient = createMockClientWithResponse('get', mockPreview);

    await getPulsePreviewCardDefinition.handler(mockClient, { id: 42 });

    expect(mockClient.get).toHaveBeenCalledWith('/api/pulse/preview_card/42');
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'Card not found');

    await expect(getPulsePreviewCardDefinition.handler(mockClient, { id: 999 })).rejects.toThrow(
      'Card not found',
    );
    expect(mockClient.get).toHaveBeenCalledWith('/api/pulse/preview_card/999');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Unauthorized', 401));

    await expect(getPulsePreviewCardDefinition.handler(mockClient, { id: 1 })).rejects.toThrow(
      'Unauthorized',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(getPulsePreviewCardDefinition.name).toBe('get_pulse_preview_card');
    expect(getPulsePreviewCardDefinition.description).toBe(
      'Get a preview of a card for use in a pulse in Metabase',
    );
    expect(getPulsePreviewCardDefinition.inputSchema).toEqual(GetPulsePreviewCardInputSchema);
  });
});
