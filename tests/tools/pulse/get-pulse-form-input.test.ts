import { GetPulseFormInputInputSchema } from '@src/schemas/pulse';
import { getPulseFormInputDefinition } from '@src/tools/pulse/get-pulse-form-input';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('getPulseFormInput tool', () => {
  it('should return formatted MCP response with form input options', async () => {
    const mockFormInput = {
      channels: [{ channel_type: 'email' }, { channel_type: 'slack' }],
      cards: [],
    };

    const mockClient = createMockClientWithResponse('get', mockFormInput);

    const result = await getPulseFormInputDefinition.handler(mockClient, {});

    expectMcpContent(result, mockFormInput);
    expect(mockClient.get).toHaveBeenCalledWith('/api/pulse/form_input');
    expect(mockClient.get).toHaveBeenCalledOnce();
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'API error');

    await expect(getPulseFormInputDefinition.handler(mockClient, {})).rejects.toThrow('API error');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Unauthorized', 401));

    await expect(getPulseFormInputDefinition.handler(mockClient, {})).rejects.toThrow(
      'Unauthorized',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(getPulseFormInputDefinition.name).toBe('get_pulse_form_input');
    expect(getPulseFormInputDefinition.description).toBe(
      'Get form input options for creating a pulse in Metabase',
    );
    expect(getPulseFormInputDefinition.inputSchema).toEqual(GetPulseFormInputInputSchema);
  });
});
