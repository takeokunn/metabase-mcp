# Changelog

## [1.2.0] - 2026-07-04

### New Features

Completed **Metabase OSS API coverage**, expanding from **415 tools** to **429 tools** across **59 categories**. Every tool was audited against the authoritative Metabase OpenAPI spec (`resources/openapi/openapi.json` / `GET /api/docs/openapi.json`), and all in-scope OSS coverage gaps were closed.

14 previously-missing OSS endpoints were added:

| Category | New tools |
|---|---|
| `metric` (new category — was empty) | `list_metrics`, `get_metric`, `get_metric_dimension_values`, `search_metric_dimension_values`, `get_metric_dimension_remapping`, `get_metric_breakout_values`, `get_metric_dataset` |
| `measure` | `get_measure_dimension_values`, `search_measure_dimension_values`, `get_measure_dimension_remapping` |
| `field` | `get_field_table_ids` |
| `slack` | `get_slack_app_info` |
| `user` | `create_user_password_reset_url` |
| `public` | `get_public_dashcard_execute` |

### Changes

Finalized OSS spec path/method alignment (`extract-tables` → `/api/llm/extract-sources`, tiles/embed dashcard query paths, `list-database-tables`) and removed 2 non-spec tools (`check_database_workspace_permission`, `export_preview_embed_dashcard_query`).

Endpoints intentionally left uncovered are all out of scope for an OSS, API-key server: Enterprise/Pro-only routes (`/api/ee/*`, `/api/mt/*` sandboxing, transforms, Metabot/agent, embedding themes, data-studio), dev-only `/api/testing/*` and telemetry, and `/api/session/*` login/logout/password auth flows.

---

## [1.1.1] - 2026-04-10

### Bug Fixes

Fixed a `tools/list` crash introduced in v1.1.0 caused by `z.record(T)` — the single-argument form of `z.record()` — being semantically broken in Zod v4. All 80 call sites across 26 schema files have been updated from `z.record(T)` to the explicit two-argument form `z.record(z.string(), T)`. Regression tests covering the affected record schemas have been added in `tests/schemas/record.test.ts`.

**Affected versions:** v1.1.0 users should upgrade to v1.1.1.

---

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
