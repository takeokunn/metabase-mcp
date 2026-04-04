import type { ToolDefinition } from '@src/tools/registry';
import { getNotificationDefinition } from './get-notification';
import { listNotificationsDefinition } from './list-notifications';
import { sendNotificationDefinition } from './send-notification';
import { sendAdhocNotificationDefinition } from './send-notification-adhoc';
import { undoNotificationUnsubscribeDefinition } from './undo-notification-unsubscribe';
import { unsubscribeNotificationDefinition } from './unsubscribe-notification';
import { unsubscribeNotificationGlobalDefinition } from './unsubscribe-notification-global';

export const notificationTools: ToolDefinition<unknown>[] = [
  listNotificationsDefinition,
  getNotificationDefinition,
  sendNotificationDefinition,
  sendAdhocNotificationDefinition,
  unsubscribeNotificationDefinition,
  unsubscribeNotificationGlobalDefinition,
  undoNotificationUnsubscribeDefinition,
];
