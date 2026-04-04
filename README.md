# @takeokunn/metabase-mcp

[![npm version](https://img.shields.io/npm/v/@takeokunn/metabase-mcp.svg)](https://www.npmjs.com/package/@takeokunn/metabase-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A Model Context Protocol (MCP) server for Metabase, enabling AI assistants to interact with your Metabase instance.

## Features

- **258 tools** across 50 categories covering the full Metabase OSS API
- **Database Management** - List, create, update, delete databases and sync metadata
- **Card/Question Management** - Create, execute, and manage saved questions
- **Dashboard Management** - Build and manage dashboards with cards, tabs, and subscriptions
- **Collection Management** - Organize content in collections with tree navigation
- **Table & Field Management** - Configure metadata, semantic types, and values
- **User & Permissions Management** - Users, groups, membership, and data access control
- **Actions** - Write-back model actions for updating data
- **Notifications** - Modern notification system for alerts and dashboard subscriptions
- **Timelines & Events** - Annotate charts with contextual timeline events
- **Embedding** - Signed JWT embedding and anonymous public sharing
- **AI Features** - X-ray auto-generated dashboards, LLM SQL generation `[Pro]`, Metabot `[Pro]`
- **Admin Tools** - Settings, email, API keys, caching, tasks, logging, and more
- **Secure API Token Authentication** - API key-based access control
- **TypeScript Implementation** - Full type safety throughout

> **Note:** Tools marked `[Requires Metabase Pro]` require a Metabase Pro or Enterprise license.

## Installation

```bash
npm install -g @takeokunn/metabase-mcp
```

Or run directly with npx:

```bash
npx @takeokunn/metabase-mcp
```

## Configuration

Set the following environment variables:

| Variable | Description | Example |
|----------|-------------|---------|
| `METABASE_URL` | Your Metabase instance URL (HTTPS required) | `https://metabase.example.com` |
| `METABASE_API_TOKEN` | Metabase API key | `mb_xxxxxxxxxxxxx` |

### Getting an API Token

1. Log in to Metabase as an admin
2. Go to **Admin Panel** → **Settings** → **Authentication** → **API Keys**
3. Click **Create API Key**
4. Copy the generated token

## Usage

### Claude Desktop Integration

Add to your Claude Desktop configuration (`~/Library/Application Support/Claude/claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "metabase": {
      "command": "npx",
      "args": ["@takeokunn/metabase-mcp"],
      "env": {
        "METABASE_URL": "https://metabase.example.com",
        "METABASE_API_TOKEN": "mb_your_api_token"
      }
    }
  }
}
```

Or if installed globally:

```json
{
  "mcpServers": {
    "metabase": {
      "command": "metabase-mcp",
      "env": {
        "METABASE_URL": "https://metabase.example.com",
        "METABASE_API_TOKEN": "mb_your_api_token"
      }
    }
  }
}
```

## Available Tools

This MCP server provides **258 tools** organized into 50 categories.

### Database Tools (11)

| Tool | Description |
|------|-------------|
| `list_databases` | List all databases connected to Metabase |
| `get_database` | Get database details by ID |
| `get_database_metadata` | Get database metadata including tables and fields |
| `list_database_schemas` | List all schemas in a database |
| `list_database_tables` | List tables in a specific schema |
| `sync_database` | Trigger a metadata sync for a database |
| `create_database` | Add a new database connection |
| `update_database` | Update database configuration |
| `delete_database` | Delete a database connection |
| `rescan_database_values` | Rescan field values for a database |
| `discard_database_values` | Discard cached field values |

### Card Tools (7)

| Tool | Description |
|------|-------------|
| `list_cards` | List all saved questions/cards |
| `get_card` | Get card details by ID |
| `get_card_metadata` | Get card metadata including query info |
| `create_card` | Create a new saved question |
| `update_card` | Update an existing card |
| `delete_card` | Delete a card |
| `execute_card` | Execute a card and return results |

### Dashboard Tools (25)

| Tool | Description |
|------|-------------|
| `list_dashboards` | List all dashboards |
| `get_dashboard` | Get dashboard details by ID |
| `get_dashboard_metadata` | Get dashboard metadata including cards |
| `create_dashboard` | Create a new dashboard |
| `update_dashboard` | Update an existing dashboard |
| `delete_dashboard` | Delete a dashboard |
| `copy_dashboard` | Copy a dashboard to a new location |
| `add_dashboard_card` | Add a card to a dashboard (v0.49+) |
| `update_dashboard_card` | Update a dashboard card position/size/settings (v0.49+) |
| `remove_dashboard_card` | Remove a card from a dashboard (v0.49+) |
| `update_dashboard_cards` | Bulk update dashboard cards (v0.49+) |
| `add_dashboard_tab` | Add a new tab to a dashboard (v0.49+) |
| `update_dashboard_tab` | Update a dashboard tab name/position (v0.49+) |
| `remove_dashboard_tab` | Remove a tab from a dashboard (v0.49+) |
| `create_dashboard_public_link` | Create a public sharing link for a dashboard |
| `delete_dashboard_public_link` | Delete a public sharing link from a dashboard |
| `list_public_dashboards` | List all dashboards with public sharing links |
| `add_dashboard_favorite` | Add a dashboard to favorites |
| `remove_dashboard_favorite` | Remove a dashboard from favorites |
| `list_dashboard_revisions` | List revision history for a dashboard |
| `revert_dashboard` | Revert a dashboard to a previous revision |
| `list_dashboard_subscriptions` | List dashboard subscriptions (email/Slack notifications) |
| `create_dashboard_subscription` | Create a dashboard subscription |
| `update_dashboard_subscription` | Update a dashboard subscription |
| `delete_dashboard_subscription` | Delete a dashboard subscription |

### Collection Tools (7)

| Tool | Description |
|------|-------------|
| `list_collections` | List all collections |
| `get_collection` | Get collection details by ID |
| `get_collection_items` | Get items within a collection |
| `get_collection_tree` | Get the full collection hierarchy tree |
| `create_collection` | Create a new collection |
| `update_collection` | Update collection properties |
| `delete_collection` | Delete a collection |

### Table Tools (5)

| Tool | Description |
|------|-------------|
| `get_table` | Get table details by ID |
| `get_table_metadata` | Get table metadata including fields |
| `update_table` | Update table properties |
| `list_table_fields` | List all fields in a table |
| `resync_table_fields` | Resync field metadata for a table |

### Field Tools (8)

| Tool | Description |
|------|-------------|
| `get_field` | Get field details by ID |
| `update_field` | Update field properties |
| `get_field_values` | Get cached values for a field |
| `update_field_values` | Update cached field values |
| `rescan_field_values` | Trigger a rescan of field values |
| `discard_field_values` | Discard cached field values |
| `get_field_related` | Get related fields and tables |
| `search_field_values` | Search for values within a field |

### Search Tools (2)

| Tool | Description |
|------|-------------|
| `search` | Full-text search across Metabase content |
| `search_models` | Search for specific model types |

### Dataset/Query Tools (2)

| Tool | Description |
|------|-------------|
| `execute_query` | Execute an ad-hoc query |
| `export_query` | Export query results in various formats |

### User Tools (9)

| Tool | Description |
|------|-------------|
| `list_users` | List all users with optional filtering |
| `get_user` | Get user details by ID |
| `create_user` | Create a new user account |
| `update_user` | Update user properties |
| `delete_user` | Deactivate a user account |
| `get_current_user` | Get the currently authenticated user |
| `update_user_password` | Update a user's password |
| `reactivate_user` | Reactivate a deactivated user |
| `send_invite` | Send an invitation email to a user |

### Permissions Tools (16)

| Tool | Description |
|------|-------------|
| `list_permission_groups` | List all permission groups |
| `get_permission_group` | Get permission group details by ID |
| `create_permission_group` | Create a new permission group |
| `update_permission_group` | Update permission group name |
| `delete_permission_group` | Delete a permission group |
| `get_data_permissions` | Get the data permissions graph |
| `update_data_permissions` | Update data permissions for groups |
| `get_collection_permissions` | Get collection permissions graph |
| `update_collection_permissions` | Update collection permissions for groups |
| `list_memberships` | List all group memberships |
| `add_membership` | Add a user to a permission group |
| `update_membership` | Update membership (e.g., set group manager) |
| `delete_membership` | Remove a user from a permission group |
| `clear_memberships` | Remove all users from a permission group |
| `get_permissions_for_db` | Get data permissions for a specific database |
| `get_permissions_for_group` | Get permissions for a specific group |

### Notification Tools (7)

| Tool | Description |
|------|-------------|
| `list_notifications` | List all notifications |
| `get_notification` | Get a notification by ID |
| `send_notification` | Send a notification immediately |
| `send_notification_adhoc` | Send an ad-hoc notification |
| `unsubscribe_notification` | Unsubscribe from a notification |
| `unsubscribe_notification_global` | Unsubscribe globally via email/hash |
| `undo_notification_unsubscribe` | Undo a notification unsubscription |

### Action Tools (10)

| Tool | Description |
|------|-------------|
| `list_actions` | List all model actions |
| `get_action` | Get an action by ID |
| `create_action` | Create a new model action |
| `update_action` | Update an existing action |
| `delete_action` | Delete an action |
| `get_action_execute_form` | Get the execution form fields for an action |
| `execute_action` | Execute a model action with parameters |
| `create_action_public_link` | Create a public link for an action |
| `delete_action_public_link` | Delete the public link for an action |
| `list_public_actions` | List all actions with public links |

### Setting Tools (4)

| Tool | Description |
|------|-------------|
| `list_settings` | List all Metabase settings |
| `get_setting` | Get a single setting by key |
| `update_setting` | Update a single setting |
| `bulk_update_settings` | Update multiple settings at once |

### Email Tools (3)

| Tool | Description |
|------|-------------|
| `configure_email` | Configure SMTP email settings |
| `clear_email` | Clear SMTP email configuration |
| `test_email` | Send a test email |

### Revision Tools (2)

| Tool | Description |
|------|-------------|
| `list_revisions` | List revisions for an entity |
| `revert_revision` | Revert an entity to a previous revision |

### API Key Tools (6)

| Tool | Description |
|------|-------------|
| `list_api_keys` | List all API keys |
| `count_api_keys` | Get the count of API keys |
| `create_api_key` | Create a new API key |
| `update_api_key` | Update an API key |
| `delete_api_key` | Delete an API key |
| `regenerate_api_key` | Regenerate an API key |

### Cache Tools (4)

| Tool | Description |
|------|-------------|
| `get_cache_config` | Get query caching configuration |
| `update_cache_config` | Update cache configuration |
| `delete_cache_config` | Remove cache configuration |
| `invalidate_cache` | Invalidate cached query results |

### Task Tools (6)

| Tool | Description |
|------|-------------|
| `list_tasks` | List scheduled tasks |
| `get_task` | Get a task by ID |
| `get_task_info` | Get task scheduler info |
| `list_task_runs` | List recent task runs |
| `get_task_run` | Get a task run by ID |
| `list_unique_tasks` | List all unique task types |

### Activity Tools (4)

| Tool | Description |
|------|-------------|
| `list_recent_views` | List recently viewed items |
| `list_recents` | List recent activity |
| `list_popular_items` | List popular items |
| `get_most_recently_viewed_dashboard` | Get the most recently viewed dashboard |

### Login History Tools (1)

| Tool | Description |
|------|-------------|
| `get_login_history` | Get login history for the current user |

### Persist Tools (10)

| Tool | Description |
|------|-------------|
| `list_persisted_models` | List all persisted models |
| `get_persisted_model` | Get a persisted model by ID |
| `get_card_persisted_model` | Get persistence info for a card |
| `persist_card` | Enable persistence for a model |
| `unpersist_card` | Disable persistence for a model |
| `refresh_persisted_model` | Refresh a persisted model |
| `enable_model_persistence` | Enable model persistence globally |
| `disable_model_persistence` | Disable model persistence globally |
| `set_persist_refresh_schedule` | Set the persistence refresh schedule |
| `persist_database_models` | Enable persistence for all database models |

### Channel Tools (5)

| Tool | Description |
|------|-------------|
| `list_channels` | List all notification channels |
| `get_channel` | Get a channel by ID |
| `create_channel` | Create a notification channel |
| `update_channel` | Update a notification channel |
| `test_channel` | Test a notification channel |

### Metric Tools (4)

| Tool | Description |
|------|-------------|
| `list_metrics` | List all metrics |
| `get_metric` | Get a metric by ID |
| `execute_metric` | Execute a metric query |
| `get_metric_breakout_values` | Get breakout dimension values for a metric |

### Model Index Tools (4)

| Tool | Description |
|------|-------------|
| `list_model_indexes` | List all model indexes |
| `get_model_index` | Get a model index by ID |
| `create_model_index` | Create a model index |
| `delete_model_index` | Delete a model index |

### Timeline Tools (7)

| Tool | Description |
|------|-------------|
| `list_timelines` | List all timelines |
| `get_timeline` | Get a timeline by ID |
| `create_timeline` | Create a timeline |
| `update_timeline` | Update a timeline |
| `delete_timeline` | Delete a timeline |
| `get_collection_root_timelines` | Get timelines in the root collection |
| `get_collection_timelines` | Get timelines in a collection |

### Timeline Event Tools (4)

| Tool | Description |
|------|-------------|
| `create_timeline_event` | Create a timeline event |
| `get_timeline_event` | Get a timeline event by ID |
| `update_timeline_event` | Update a timeline event |
| `delete_timeline_event` | Delete a timeline event |

### Segment Tools (6)

| Tool | Description |
|------|-------------|
| `list_segments` | Get list of all segments |
| `get_segment` | Get a segment by ID |
| `create_segment` | Create a new segment |
| `update_segment` | Update an existing segment |
| `delete_segment` | Delete a segment |
| `get_segment_revisions` | Get revision history of a segment |

### Snippet Tools (5)

| Tool | Description |
|------|-------------|
| `list_snippets` | Get list of native query snippets |
| `get_snippet` | Get a native query snippet by ID |
| `create_snippet` | Create a new native query snippet |
| `update_snippet` | Update a native query snippet |
| `archive_snippet` | Archive a native query snippet |

### Bookmark Tools (4)

| Tool | Description |
|------|-------------|
| `list_bookmarks` | List all bookmarks for the current user |
| `create_bookmark` | Create a bookmark |
| `delete_bookmark` | Delete a bookmark |
| `reorder_bookmarks` | Reorder bookmarks |

### GeoJSON Tools (2)

| Tool | Description |
|------|-------------|
| `list_geojson` | List all custom GeoJSON files |
| `get_geojson` | Get a GeoJSON file by key |

### Upload Tools (1)

| Tool | Description |
|------|-------------|
| `upload_csv` | Upload a CSV file to create a new table |

### Slack Tools (4) `[Requires Metabase Pro]`

| Tool | Description |
|------|-------------|
| `update_slack_settings` | Update Slack integration settings |
| `get_slack_app_info` | Get Slack app info |
| `get_slack_manifest` | Get Slack app manifest |
| `send_slack_bug_report` | Send a bug report via Slack |

### Google Tools (1)

| Tool | Description |
|------|-------------|
| `update_google_settings` | Update Google SSO settings |

### LDAP Tools (1)

| Tool | Description |
|------|-------------|
| `update_ldap_settings` | Update LDAP authentication settings |

### Embed Tools (8)

| Tool | Description |
|------|-------------|
| `get_embed_card` | Get an embedded card by JWT token |
| `get_embed_card_query` | Execute an embedded card query |
| `get_embed_card_query_format` | Export an embedded card query in a format |
| `get_embed_dashboard` | Get an embedded dashboard |
| `get_embed_dashboard_query` | Execute an embedded dashboard card query |
| `get_embed_dashboard_query_format` | Export an embedded dashboard card query |
| `get_embed_dashboard_params` | Get values for an embed dashboard parameter |
| `search_embed_dashboard_params` | Search embed dashboard parameter values |

### Public Tools (8)

| Tool | Description |
|------|-------------|
| `get_public_card` | Get a publicly shared card by UUID |
| `get_public_card_query` | Execute a public card query |
| `get_public_card_query_format` | Export a public card query in a format |
| `get_public_dashboard` | Get a publicly shared dashboard |
| `get_public_dashboard_query` | Execute a public dashboard card query |
| `get_public_dashboard_query_format` | Export a public dashboard card query |
| `get_public_dashboard_params` | Get values for a public dashboard parameter |
| `search_public_dashboard_params` | Search public dashboard parameter values |

### Preview Embed Tools (5)

| Tool | Description |
|------|-------------|
| `preview_embed_card` | Preview an embed card (admin) |
| `preview_embed_card_query` | Preview an embed card query (admin) |
| `preview_embed_dashboard` | Preview an embed dashboard (admin) |
| `preview_embed_dashboard_query` | Preview an embed dashboard query (admin) |
| `preview_embed_dashboard_params` | Preview embed dashboard parameter values |

### Automagic Dashboard Tools (7)

| Tool | Description |
|------|-------------|
| `get_xray_table` | Get auto-generated X-ray dashboard for a table |
| `get_xray_table_cell` | Get X-ray for a specific table cell value |
| `get_xray_database_candidates` | Get X-ray candidates for a database |
| `get_xray_card` | Get auto-generated X-ray for a saved question |
| `get_xray_segment` | Get auto-generated X-ray for a segment |
| `get_xray_field` | Get auto-generated X-ray for a field |
| `get_xray_metric` | Get auto-generated X-ray for a metric |

### Comment Tools (5)

| Tool | Description |
|------|-------------|
| `list_comments` | List comments on a model |
| `create_comment` | Create a comment |
| `update_comment` | Update a comment |
| `delete_comment` | Delete a comment |
| `add_comment_reaction` | Add an emoji reaction to a comment |

### Glossary Tools (4)

| Tool | Description |
|------|-------------|
| `list_glossary` | List all glossary entries |
| `create_glossary_entry` | Create a glossary entry |
| `update_glossary_entry` | Update a glossary entry |
| `delete_glossary_entry` | Delete a glossary entry |

### LLM Tools (3) `[Requires Metabase Pro]`

| Tool | Description |
|------|-------------|
| `generate_sql` | Generate SQL from a natural language question |
| `extract_tables_from_sql` | Extract table references from SQL |
| `list_llm_models` | List available LLM models |

### Metabot Tools (4) `[Requires Metabase Pro]`

| Tool | Description |
|------|-------------|
| `query_metabot` | Query the Metabot AI assistant |
| `feedback_metabot` | Submit feedback for a Metabot response |
| `get_metabot_settings` | Get Metabot settings |
| `update_metabot_settings` | Update Metabot settings |

### Premium Features Tools (2) `[Requires Metabase Pro]`

| Tool | Description |
|------|-------------|
| `get_premium_token_status` | Get the status of the premium license token |
| `refresh_premium_token` | Refresh the premium license token |

### Cloud Migration Tools (3)

| Tool | Description |
|------|-------------|
| `initiate_cloud_migration` | Start a cloud migration |
| `get_cloud_migration` | Get the current cloud migration status |
| `cancel_cloud_migration` | Cancel an in-progress cloud migration |

### Map Tile Tools (3)

| Tool | Description |
|------|-------------|
| `get_card_map_tile` | Get a map tile for a card with lat/lon fields |
| `get_field_map_tile` | Get a map tile using field IDs |
| `get_table_map_tile` | Get a map tile for a table |

### User Key-Value Tools (4)

| Tool | Description |
|------|-------------|
| `get_user_key_value` | Get a per-user key-value setting |
| `put_user_key_value` | Set a per-user key-value setting |
| `delete_user_key_value` | Delete a per-user key-value setting |
| `list_user_namespace_values` | List all key-value pairs in a namespace |

### Bug Reporting Tools (2)

| Tool | Description |
|------|-------------|
| `get_bug_reporting_details` | Get diagnostic details for bug reports |
| `get_connection_pool_details` | Get database connection pool details |

### Logger Tools (4)

| Tool | Description |
|------|-------------|
| `get_logs` | Get server logs with optional filters |
| `create_log_adjustment` | Temporarily adjust a logger's level |
| `delete_log_adjustment` | Remove a log level adjustment |
| `list_log_presets` | List log level presets |

### Moderation Review Tools (1)

| Tool | Description |
|------|-------------|
| `create_moderation_review` | Submit a moderation review for content |

### Setup Tools (1)

| Tool | Description |
|------|-------------|
| `check_setup_token` | Get the admin setup checklist |

### EID Translation Tools (1)

| Tool | Description |
|------|-------------|
| `translate_entity_ids` | Translate entity IDs to their internal equivalents |

## Requirements

- Node.js 22+
- Metabase instance with API access (v0.49+)

## License

[MIT](LICENSE)
