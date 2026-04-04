# Changelog

## [1.1.0] - 2026-04-04

### Breaking Changes

The `/api/alert` tools have been removed and replaced by the modern `/api/notification` system.

| Removed Tool | Replacement Tool |
|---|---|
| `list_alerts` | `list_notifications` |
| `get_alert` | `get_notification` |
| `create_alert` | `create_notification` |
| `update_alert` | `update_notification` |
| `delete_alert` | `delete_notification` |

See the [Migration Guide](#migration-guide) below.

### New Features

Expanded Metabase API coverage from **105 tools** to **258 tools** across **50 categories**.

#### New categories added:

| Category | Tools | Notes |
|---|---|---|
| `notification` | 7 | Standalone notification management (replaces `alert`) |
| `action` | 10 | Write-back model actions |
| `setting` | 4 | Instance configuration |
| `email` | 3 | SMTP configuration |
| `revision` | 2 | Generic revision history |
| `api-key` | 6 | API key management |
| `permissions` (extended) | +7 | Group membership management |
| `timeline` | 7 | Chart event annotations |
| `timeline-event` | 4 | Timeline event CRUD |
| `cache` | 4 | Query result caching |
| `task` | 6 | Background task inspection |
| `activity` | 4 | Recent views and popular items |
| `login-history` | 1 | Login audit |
| `persist` | 10 | Model persistence |
| `channel` | 5 | Notification channels |
| `metric` | 4 | Metrics v2 API |
| `model-index` | 4 | Model search indexing |
| `geojson` | 2 | Custom map GeoJSON |
| `slack` | 4 | Slack integration `[Requires Metabase Pro]` |
| `upload` | 1 | CSV upload |
| `google` | 1 | Google SSO settings |
| `ldap` | 1 | LDAP settings |
| `embed` | 8 | Signed JWT embedding |
| `public` | 8 | Anonymous public access |
| `preview-embed` | 5 | Admin embed preview |
| `automagic-dashboard` | 7 | X-ray auto-generated dashboards |
| `comment` | 5 | Comments on cards/dashboards |
| `glossary` | 4 | Data glossary |
| `llm` | 3 | AI SQL generation `[Requires Metabase Pro]` |
| `metabot` | 4 | AI assistant `[Requires Metabase Pro]` |
| `premium-features` | 2 | License token status `[Requires Metabase Pro]` |
| `cloud-migration` | 3 | Cloud migration management |
| `tiles` | 3 | Map tile rendering |
| `user-key-value` | 4 | Per-user preference store |
| `bug-reporting` | 2 | Diagnostic info |
| `logger` | 4 | Log level management |
| `moderation-review` | 1 | Content verification |
| `setup` | 1 | Admin setup checklist |
| `eid-translation` | 1 | Entity ID translation |

### Migration Guide

If you use any alert tools in your Claude Desktop config, prompts, or automation, update them to use the notification equivalents:

**Before:**
```
list_alerts, get_alert, create_alert, update_alert, delete_alert
```

**After:**
```
list_notifications, get_notification, create_notification, update_notification, delete_notification
```

The notification API supports the same scheduling and delivery options as alerts, and additionally covers dashboard subscriptions (previously `create_dashboard_subscription`, etc., which remain unchanged).

---

## [1.0.4] - Earlier releases

See git history for earlier changes.
