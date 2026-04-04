import type { ToolDefinition } from '@src/tools/registry';
import { updateGoogleSettingsDefinition } from './update-google-settings';

export const googleTools: ToolDefinition<unknown>[] = [updateGoogleSettingsDefinition];
