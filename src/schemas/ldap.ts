import { z } from 'zod';

// Update LDAP settings input schema
export const UpdateLdapSettingsInputSchema = z.object({
  'ldap-enabled': z.boolean().optional().describe('Whether LDAP authentication is enabled'),
  'ldap-host': z.string().optional().describe('LDAP server hostname'),
  'ldap-port': z.number().optional().describe('LDAP server port'),
  'ldap-bind-dn': z.string().optional().describe('DN used to bind to the LDAP server'),
  'ldap-password': z.string().optional().describe('Password for LDAP bind DN'),
  'ldap-user-base': z.string().optional().describe('Base DN for user searches'),
  'ldap-user-filter': z.string().optional().describe('LDAP filter for user lookups'),
  'ldap-group-sync': z.boolean().optional().describe('Whether to sync LDAP groups'),
  'ldap-group-base': z.string().optional().describe('Base DN for group searches'),
});

// Inferred types
export type UpdateLdapSettingsInput = z.infer<typeof UpdateLdapSettingsInputSchema>;
