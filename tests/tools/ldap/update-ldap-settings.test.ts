import { UpdateLdapSettingsInputSchema } from '@src/schemas/ldap';
import { updateLdapSettingsDefinition } from '@src/tools/ldap/update-ldap-settings';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('updateLdapSettings tool', () => {
  it('should return formatted MCP response', async () => {
    const mockResult = { success: true };
    const mockClient = createMockClientWithResponse('put', mockResult);
    const input = {
      'ldap-enabled': true,
      'ldap-host': 'ldap.example.com',
      'ldap-port': 389,
    };
    const result = await updateLdapSettingsDefinition.handler(mockClient, input);
    expectMcpContent(result, mockResult);
    expect(mockClient.put).toHaveBeenCalledWith('/api/ldap/settings', input);
  });

  it('should work with all fields', async () => {
    const mockResult = { success: true };
    const mockClient = createMockClientWithResponse('put', mockResult);
    const input = {
      'ldap-enabled': true,
      'ldap-host': 'ldap.example.com',
      'ldap-port': 389,
      'ldap-bind-dn': 'cn=admin,dc=example,dc=com',
      'ldap-password': 'secret',
      'ldap-user-base': 'ou=users,dc=example,dc=com',
      'ldap-user-filter': '(&(objectClass=inetOrgPerson)(uid={login}))',
      'ldap-group-sync': true,
      'ldap-group-base': 'ou=groups,dc=example,dc=com',
    };
    await updateLdapSettingsDefinition.handler(mockClient, input);
    expect(mockClient.put).toHaveBeenCalledWith('/api/ldap/settings', input);
  });

  it('should work with empty input', async () => {
    const mockResult = { success: true };
    const mockClient = createMockClientWithResponse('put', mockResult);
    const result = await updateLdapSettingsDefinition.handler(mockClient, {});
    expectMcpContent(result, mockResult);
    expect(mockClient.put).toHaveBeenCalledWith('/api/ldap/settings', {});
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('put', 'API error');
    await expect(updateLdapSettingsDefinition.handler(mockClient, {})).rejects.toThrow('API error');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('put', createApiError('Forbidden', 403));
    await expect(updateLdapSettingsDefinition.handler(mockClient, {})).rejects.toThrow('Forbidden');
  });

  it('should have correct tool definition metadata', () => {
    expect(updateLdapSettingsDefinition.name).toBe('update_ldap_settings');
    expect(updateLdapSettingsDefinition.description).toBe(
      'Update LDAP authentication settings in Metabase',
    );
    expect(updateLdapSettingsDefinition.inputSchema).toEqual(UpdateLdapSettingsInputSchema);
  });
});
