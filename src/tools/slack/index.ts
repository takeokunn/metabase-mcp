import type { ToolDefinition } from '@src/tools/registry';
import { getSlackAppInfoDefinition } from './get-slack-app-info';
import { getSlackManifestDefinition } from './get-slack-manifest';
import { sendSlackBugReportDefinition } from './send-slack-bug-report';
import { updateSlackSettingsDefinition } from './update-slack-settings';

export const slackTools: ToolDefinition<unknown>[] = [
  updateSlackSettingsDefinition,
  getSlackManifestDefinition,
  sendSlackBugReportDefinition,
  getSlackAppInfoDefinition,
];
