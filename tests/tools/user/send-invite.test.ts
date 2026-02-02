import type { MetabaseClient } from '@src/client';
import { SendInviteInputSchema } from '@src/schemas/user';
import { sendInviteDefinition } from '@src/tools/user/send-invite';
import { describe, expect, it, vi } from 'vitest';

describe('sendInvite tool', () => {
  it('should return formatted MCP response on successful invite send', async () => {
    const mockResponse = {
      success: true,
    };

    const mockClient = {
      post: vi.fn().mockResolvedValue(mockResponse),
    } as unknown as MetabaseClient;

    const input = {
      id: 1,
    };

    const result = await sendInviteDefinition.handler(mockClient, input);

    expect(result.content).toHaveLength(1);
    expect(result.content[0].type).toBe('text');
    expect(JSON.parse((result.content[0] as { text: string }).text)).toEqual(mockResponse);
    expect(mockClient.post).toHaveBeenCalledWith('/api/user/1/send_invite');
    expect(mockClient.post).toHaveBeenCalledOnce();
  });

  it('should propagate client errors', async () => {
    const mockClient = {
      post: vi.fn().mockRejectedValue(new Error('User not found')),
    } as unknown as MetabaseClient;

    const input = {
      id: 999,
    };

    await expect(sendInviteDefinition.handler(mockClient, input)).rejects.toThrow('User not found');
  });

  it('should propagate email configuration errors', async () => {
    const apiError = new Error('Email is not configured');
    (apiError as Error & { status?: number }).status = 400;

    const mockClient = {
      post: vi.fn().mockRejectedValue(apiError),
    } as unknown as MetabaseClient;

    const input = {
      id: 1,
    };

    await expect(sendInviteDefinition.handler(mockClient, input)).rejects.toThrow(
      'Email is not configured',
    );
  });

  it('should propagate permission errors', async () => {
    const apiError = new Error('You do not have permission to send invites');
    (apiError as Error & { status?: number }).status = 403;

    const mockClient = {
      post: vi.fn().mockRejectedValue(apiError),
    } as unknown as MetabaseClient;

    const input = {
      id: 1,
    };

    await expect(sendInviteDefinition.handler(mockClient, input)).rejects.toThrow(
      'You do not have permission to send invites',
    );
  });

  it('should propagate deactivated user errors', async () => {
    const apiError = new Error('Cannot send invite to deactivated user');
    (apiError as Error & { status?: number }).status = 400;

    const mockClient = {
      post: vi.fn().mockRejectedValue(apiError),
    } as unknown as MetabaseClient;

    const input = {
      id: 1,
    };

    await expect(sendInviteDefinition.handler(mockClient, input)).rejects.toThrow(
      'Cannot send invite to deactivated user',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(sendInviteDefinition.name).toBe('send_invite');
    expect(sendInviteDefinition.description).toBe('Send an invite email to a user in Metabase');
    expect(sendInviteDefinition.inputSchema).toEqual(SendInviteInputSchema);
  });
});
