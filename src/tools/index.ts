import { actionTools } from './action';
import { activityTools } from './activity';
import { alertTools } from './alert';
import { pulseTools } from './pulse';
import { apiKeyTools } from './api-key';
import { automagicDashboardTools } from './automagic-dashboard';
import { bookmarkTools } from './bookmark';
import { bugReportingTools } from './bug-reporting';
import { cacheTools } from './cache';
import { cardTools } from './card';
import { channelTools } from './channel';
import { cloudMigrationTools } from './cloud-migration';
import { collectionTools } from './collection';
import { commentTools } from './comment';
import { dashboardTools } from './dashboard';
import { databaseTools } from './database';
import { datasetTools } from './dataset';
import { eidTranslationTools } from './eid-translation';
import { emailTools } from './email';
import { embedTools } from './embed';
import { fieldTools } from './field';
import { geojsonTools } from './geojson';
import { glossaryTools } from './glossary';
import { googleTools } from './google';
import { ldapTools } from './ldap';
import { llmTools } from './llm';
import { loggerTools } from './logger';
import { loginHistoryTools } from './login-history';
import { modelIndexTools } from './model-index';
import { moderationReviewTools } from './moderation-review';
import { notificationTools } from './notification';
import { permissionsTools } from './permissions';
import { persistTools } from './persist';
import { premiumFeaturesTools } from './premium-features';
import { previewEmbedTools } from './preview-embed';
import { publicTools } from './public';
import type { ToolDefinition } from './registry';
import { revisionTools } from './revision';
import { searchTools } from './search';
import { segmentTools } from './segment';
import { settingTools } from './setting';
import { setupTools } from './setup';
import { slackTools } from './slack';
import { snippetTools } from './snippet';
import { tableTools } from './table';
import { taskTools } from './task';
import { tilesTools } from './tiles';
import { timelineEventTools } from './timeline-event';
import { timelineTools } from './timeline';
import { uploadTools } from './upload';
import { analyticsTools } from './analytics';
import { notifyTools } from './notify';
import { userKeyValueTools } from './user-key-value';
import { userTools } from './user';

/**
 * All tool definitions combined from all categories
 */
export const allTools: ToolDefinition<unknown>[] = [
  // Core data
  ...databaseTools,
  ...collectionTools,
  ...dashboardTools,
  ...cardTools,
  ...searchTools,
  ...tableTools,
  ...datasetTools,
  ...fieldTools,
  ...userTools,
  ...permissionsTools,
  ...segmentTools,
  ...snippetTools,
  ...bookmarkTools,
  // Notifications & alerts
  ...notificationTools,
  ...alertTools,
  ...pulseTools,
  // Actions
  ...actionTools,
  // Admin & settings
  ...settingTools,
  ...emailTools,
  ...revisionTools,
  ...apiKeyTools,
  ...cacheTools,
  ...taskTools,
  ...activityTools,
  ...loginHistoryTools,
  // Integrations
  ...slackTools,
  ...googleTools,
  ...ldapTools,
  // Model features
  ...persistTools,
  ...channelTools,
  ...modelIndexTools,
  // Timelines
  ...timelineTools,
  ...timelineEventTools,
  // Upload
  ...uploadTools,
  // Maps
  ...geojsonTools,
  ...tilesTools,
  // Embedding & public
  ...embedTools,
  ...publicTools,
  ...previewEmbedTools,
  // X-ray / automagic
  ...automagicDashboardTools,
  // Collaboration
  ...commentTools,
  ...glossaryTools,
  ...moderationReviewTools,
  // AI features
  ...llmTools,
  // Enterprise / premium
  ...premiumFeaturesTools,
  // Platform
  ...cloudMigrationTools,
  ...bugReportingTools,
  ...loggerTools,
  ...userKeyValueTools,
  ...setupTools,
  ...eidTranslationTools,
  // Notifications (push/email dispatch)
  ...notifyTools,
  // Analytics
  ...analyticsTools,
];

export type { ToolDefinition, ToolResponse } from './registry';
export { formatErrorResponse, formatToolResponse, registerTools } from './registry';
