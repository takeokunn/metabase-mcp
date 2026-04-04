import type { ToolDefinition } from '@src/tools/registry';
import { updateLdapSettingsDefinition } from './update-ldap-settings';

export const ldapTools: ToolDefinition<unknown>[] = [updateLdapSettingsDefinition];
