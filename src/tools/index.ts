import { actionTools } from './action';
import { activityTools } from './activity';
import { alertTools } from './alert';
import { analyticsTools } from './analytics';
import { apiKeyTools } from './api-key';
import { automagicDashboardTools } from './automagic-dashboard';
import { bookmarkTools } from './bookmark';
import { bugReportingTools } from './bug-reporting';
import { cacheTools } from './cache';
import { cardTools } from './card';
import { cardsBulkTools } from './cards-bulk';
import { channelTools } from './channel';
import { cloudMigrationTools } from './cloud-migration';
import { collectionTools } from './collection';
import { commentTools } from './comment';
import { dashboardTools } from './dashboard';
import { databaseTools } from './database';
import { datasetTools } from './dataset';
import { documentTools } from './document';
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
import { measureTools } from './measure';
import { metricTools } from './metric';
import { modelIndexTools } from './model-index';
import { moderationReviewTools } from './moderation-review';
import { notificationTools } from './notification';
import { notifyTools } from './notify';
import { permissionsTools } from './permissions';
import { persistTools } from './persist';
import { premiumFeaturesTools } from './premium-features';
import { previewEmbedTools } from './preview-embed';
import { productFeedbackTools } from './product-feedback';
import { publicTools } from './public';
import { pulseTools } from './pulse';
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
import { timelineTools } from './timeline';
import { timelineEventTools } from './timeline-event';
import { uploadTools } from './upload';
import { userTools } from './user';
import { userKeyValueTools } from './user-key-value';
import { utilTools } from './util';

/**
 * All tool definitions combined from all categories
 */
export const allTools: ToolDefinition<unknown>[] = [
  // Core data
  ...databaseTools,
  ...collectionTools,
  ...dashboardTools,
  ...cardTools,
  ...cardsBulkTools,
  ...searchTools,
  ...tableTools,
  ...datasetTools,
  ...fieldTools,
  ...userTools,
  ...permissionsTools,
  ...segmentTools,
  ...snippetTools,
  ...bookmarkTools,
  ...documentTools,
  ...measureTools,
  ...metricTools,
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
  // Misc utilities
  ...productFeedbackTools,
  ...utilTools,
];

export type { ToolDefinition, ToolResponse } from './registry';
export { formatErrorResponse, formatToolResponse, registerTools } from './registry';
