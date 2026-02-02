import type { MetabaseClient } from '@src/client';
import { UpdateFieldInputSchema } from '@src/schemas/field';
import { updateFieldDefinition } from '@src/tools/field/update-field';
import { describe, expect, it, vi } from 'vitest';

describe('updateField tool', () => {
  it('should return formatted MCP response with updated field data', async () => {
    const mockUpdatedField = {
      id: 1,
      name: 'email',
      display_name: 'User Email',
      description: 'Primary email address',
      base_type: 'type/Text',
      semantic_type: 'type/Email',
      visibility_type: 'normal',
      table_id: 5,
    };

    const mockClient = {
      put: vi.fn().mockResolvedValue(mockUpdatedField),
    } as unknown as MetabaseClient;

    const result = await updateFieldDefinition.handler(mockClient, {
      id: 1,
      display_name: 'User Email',
      description: 'Primary email address',
      semantic_type: 'type/Email',
    });

    expect(result.content).toHaveLength(1);
    expect(result.content[0].type).toBe('text');
    expect(JSON.parse((result.content[0] as { text: string }).text)).toEqual(mockUpdatedField);
    expect(mockClient.put).toHaveBeenCalledWith('/api/field/1', {
      display_name: 'User Email',
      description: 'Primary email address',
      semantic_type: 'type/Email',
    });
    expect(mockClient.put).toHaveBeenCalledOnce();
  });

  it('should handle update with visibility type', async () => {
    const mockUpdatedField = {
      id: 42,
      name: 'ssn',
      display_name: 'Social Security Number',
      visibility_type: 'sensitive',
      table_id: 10,
    };

    const mockClient = {
      put: vi.fn().mockResolvedValue(mockUpdatedField),
    } as unknown as MetabaseClient;

    const result = await updateFieldDefinition.handler(mockClient, {
      id: 42,
      visibility_type: 'sensitive',
    });

    expect(result.content[0].type).toBe('text');
    expect(JSON.parse((result.content[0] as { text: string }).text)).toEqual(mockUpdatedField);
    expect(mockClient.put).toHaveBeenCalledWith('/api/field/42', {
      visibility_type: 'sensitive',
    });
  });

  it('should handle update with foreign key target', async () => {
    const mockUpdatedField = {
      id: 10,
      name: 'user_id',
      semantic_type: 'type/FK',
      fk_target_field_id: 1,
      table_id: 20,
    };

    const mockClient = {
      put: vi.fn().mockResolvedValue(mockUpdatedField),
    } as unknown as MetabaseClient;

    const result = await updateFieldDefinition.handler(mockClient, {
      id: 10,
      semantic_type: 'type/FK',
      fk_target_field_id: 1,
    });

    expect(result.content[0].type).toBe('text');
    expect(JSON.parse((result.content[0] as { text: string }).text)).toEqual(mockUpdatedField);
    expect(mockClient.put).toHaveBeenCalledWith('/api/field/10', {
      semantic_type: 'type/FK',
      fk_target_field_id: 1,
    });
  });

  it('should propagate client errors', async () => {
    const mockClient = {
      put: vi.fn().mockRejectedValue(new Error('Field not found')),
    } as unknown as MetabaseClient;

    await expect(
      updateFieldDefinition.handler(mockClient, { id: 999, display_name: 'Test' }),
    ).rejects.toThrow('Field not found');
    expect(mockClient.put).toHaveBeenCalledWith('/api/field/999', { display_name: 'Test' });
  });

  it('should propagate API errors with status codes', async () => {
    const apiError = new Error('Forbidden');
    (apiError as Error & { status?: number }).status = 403;

    const mockClient = {
      put: vi.fn().mockRejectedValue(apiError),
    } as unknown as MetabaseClient;

    await expect(
      updateFieldDefinition.handler(mockClient, { id: 1, display_name: 'Test' }),
    ).rejects.toThrow('Forbidden');
  });

  it('should have correct tool definition metadata', () => {
    expect(updateFieldDefinition.name).toBe('update_field');
    expect(updateFieldDefinition.description).toBe(
      'Update field metadata including display name, description, semantic type, and visibility settings',
    );
    expect(updateFieldDefinition.inputSchema).toEqual(UpdateFieldInputSchema);
  });
});
