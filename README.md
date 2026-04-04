# @takeokunn/metabase-mcp

[![npm version](https://img.shields.io/npm/v/@takeokunn/metabase-mcp.svg)](https://www.npmjs.com/package/@takeokunn/metabase-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A Model Context Protocol (MCP) server for Metabase, enabling AI assistants to interact with your Metabase instance.

## Features

- **418 tools** across 58 categories covering the Metabase OSS API
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

This MCP server provides **418 tools** organized into 58 categories.

### Database Tools (31)

| Tool | Description |
|------|-------------|
| `list_databases` | Get list of databases configured in Metabase |
| `get_database` | Get a single database by ID from Metabase |
| `get_database_metadata` | Get database metadata including tables and fields from Metabase |
| `list_database_schemas` | List all schemas in a database from Metabase |
| `list_database_tables` | List tables in a database schema from Metabase |
| `sync_database` | Trigger a sync for a database in Metabase |
| `create_database` | Add a new database connection to Metabase |
| `update_database` | Update an existing database connection configuration in Metabase |
| `delete_database` | Delete a database connection from Metabase |
| `rescan_database_values` | Rescan field values for a database in Metabase |
| `discard_database_values` | Discard cached field values for a database in Metabase |
| `validate_database` | Validate a database connection configuration before creating it in Metabase |
| `create_sample_database` | Create the built-in sample database in Metabase |
| `sync_database_schema` | Sync the schema of a database in Metabase (schema only, not a full resync) |
| `get_database_fields` | Get all fields for a database in Metabase |
| `get_database_id_fields` | Get all ID-type fields for a database in Metabase |
| `get_database_autocomplete` | Get autocomplete suggestions for a database in Metabase |
| `get_database_usage_info` | Get usage information for a database in Metabase |
| `get_database_healthcheck` | Perform a healthcheck on a database connection in Metabase |
| `list_database_schemas_with_tables` | List all tables within a specific schema of a database in Metabase |
| `list_database_virtual_tables` | List virtual tables (saved questions) available as tables in a database in Metabase |
| `get_database_virtual_schema` | Get a virtual schema (datasets) for a database in Metabase |
| `list_database_virtual_schema_tables` | List all virtual tables (saved questions as tables) across all databases in Metabase |
| `append_csv_to_table` | Append rows from a CSV upload to an existing table in a database in Metabase |
| `replace_table_csv` | Replace an existing table with CSV data in a database in Metabase |
| `get_database_card_autocomplete` | Get card autocomplete suggestions for a database in Metabase |
| `get_database_available_settings` | Get available settings for a database connection in Metabase |
| `get_database_syncable_schemas` | Get syncable schemas for a database in Metabase |
| `get_virtual_database_datasets` | Get datasets for a virtual database in Metabase |
| `dismiss_database_spinner` | Dismiss the loading spinner for a database in Metabase |
| `check_database_workspace_permission` | Check workspace permission for a database in Metabase |

### Card Tools (20)

| Tool | Description |
|------|-------------|
| `list_cards` | List all saved questions/cards |
| `get_card` | Get card details by ID |
| `get_card_metadata` | Get card metadata including query info |
| `create_card` | Create a new saved question |
| `update_card` | Update an existing card |
| `delete_card` | Delete a card |
| `execute_card` | Execute a card and return results |
| `create_card_public_link` | Create a public sharing link for a card (saved question) in Metabase (returns UUID) |
| `delete_card_public_link` | Delete a public sharing link from a card (saved question) in Metabase |
| `list_embeddable_cards` | List all cards (saved questions) available for embedding in Metabase (admin only) |
| `list_public_cards` | List all cards (saved questions) with public sharing links in Metabase (admin only) |
| `copy_card` | Copy an existing card (saved question) in Metabase |
| `get_card_series` | Get related series data for a card (saved question) in Metabase |
| `get_card_param_values` | Get possible values for a card (saved question) filter parameter in Metabase |
| `search_card_param_values` | Search possible values for a card (saved question) filter parameter in Metabase |
| `get_card_param_remapping` | Get remapping for a parameter of a card in Metabase |
| `get_card_dashboards` | Get dashboards that contain a specific card in Metabase |
| `move_cards_to_collection` | Move multiple cards to a collection in Metabase |
| `execute_card_pivot` | Execute a card (saved question) as a pivot table query in Metabase |
| `export_card_query` | Export a card (saved question) query result in a specified format (csv, json, xlsx, pdf) in Metabase |

### Dashboard Tools (38)

| Tool | Description |
|------|-------------|
| `list_dashboards` | List all dashboards |
| `get_dashboard` | Get dashboard details by ID |
| `create_dashboard` | Create a new dashboard |
| `update_dashboard` | Update an existing dashboard |
| `delete_dashboard` | Delete a dashboard |
| `copy_dashboard` | Copy a dashboard to a new location |
| `get_dashboard_metadata` | Get dashboard metadata including cards |
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
| `list_dashboard_revisions` | List revision history for a dashboard |
| `revert_dashboard` | Revert a dashboard to a previous revision |
| `list_dashboard_subscriptions` | List dashboard subscriptions (email/Slack notifications) |
| `create_dashboard_subscription` | Create a dashboard subscription |
| `update_dashboard_subscription` | Update a dashboard subscription |
| `execute_dashboard_card_query` | Execute a dashcard query with dashboard filter parameters in Metabase |
| `export_dashboard_card_query` | Export a dashcard query result in a specified format (csv, json, xlsx, pdf) in Metabase |
| `get_dashboard_param_values` | Get possible values for a dashboard filter parameter in Metabase |
| `search_dashboard_param_values` | Search possible values for a dashboard filter parameter in Metabase |
| `get_dashboard_embeddable` | List all dashboards available for embedding in Metabase (admin only) |
| `get_dashboard_param_remapping` | Get remapping for a parameter of a dashboard in Metabase |
| `get_dashboard_related` | Get related items for a dashboard in Metabase |
| `get_valid_filter_fields` | Get valid filter fields for dashboard parameters in Metabase |
| `save_dashboard` | Save a dashboard (creates or updates) in Metabase |
| `save_dashboard_to_collection` | Save a dashboard to a specific collection in Metabase |
| `get_dashboard_items` | Get items (dashcards) of a dashboard in Metabase |
| `get_dashcard_action_params` | Get action parameters for a dashcard in Metabase |
| `run_dashcard_query` | Run the query for a specific card on a dashboard in Metabase |
| `export_dashcard_query` | Export query results for a dashcard in Metabase |
| `execute_dashcard_action` | Execute an action on a dashcard in Metabase |
| `pivot_dashcard_query` | Run a pivot query for a specific dashcard in Metabase |

### Collection Tools (15)

| Tool | Description |
|------|-------------|
| `list_collections` | List all collections |
| `get_collection` | Get collection details by ID |
| `get_collection_items` | Get items within a collection |
| `get_collection_tree` | Get the full collection hierarchy tree |
| `get_root_collection` | Get the root collection from Metabase |
| `get_root_collection_items` | Get items (cards, dashboards, etc.) within the root collection in Metabase |
| `get_trash_collection` | Get the trash collection from Metabase |
| `create_collection` | Create a new collection |
| `update_collection` | Update collection properties |
| `delete_collection` | Delete a collection |
| `hard_delete_collection` | Permanently delete a collection in Metabase (cannot be undone) |
| `get_root_dashboard_question_candidates` | Get dashboard question candidates from the root collection in Metabase |
| `get_collection_dashboard_question_candidates` | Get dashboard question candidates from a collection in Metabase |
| `move_root_dashboard_question_candidates` | Move dashboard question candidates from the root collection in Metabase |
| `move_collection_dashboard_question_candidates` | Move dashboard question candidates from a collection in Metabase |

### Table Tools (14)

| Tool | Description |
|------|-------------|
| `list_all_tables` | List all tables across all databases in Metabase |
| `get_table` | Get table details by ID |
| `get_table_metadata` | Get table metadata including fields |
| `update_table` | Update table properties |
| `bulk_update_tables` | Bulk update multiple tables in Metabase |
| `resync_table_fields` | Resync field metadata for a table |
| `get_table_foreign_keys` | Get foreign keys for a table in Metabase |
| `sync_table_schema` | Sync the schema for a table in Metabase |
| `discard_table_values` | Discard cached field values for a table in Metabase |
| `get_table_related` | Get related tables and cards for a table in Metabase |
| `update_table_fields_order` | Reorder fields in a table in Metabase |
| `get_virtual_card_table_fks` | Get foreign keys for a virtual card-based table in Metabase |
| `get_virtual_card_table_query_metadata` | Get query metadata for a virtual card-based table in Metabase |
| `get_table_data` | Get data rows from a table in Metabase |

### Field Tools (12)

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
| `create_field_dimension` | Create a dimension (remapping) for a field in Metabase |
| `delete_field_dimension` | Delete a dimension (remapping) from a field in Metabase |
| `get_field_remapping` | Get remapping between two fields in Metabase |
| `get_field_summary` | Get summary statistics for a field in Metabase |

### Search Tools (5)

| Tool | Description |
|------|-------------|
| `search` | Full-text search across Metabase content |
| `get_search_weights` | Get search result ranking weights in Metabase |
| `update_search_weights` | Update search result ranking weights in Metabase |
| `force_reindex_search` | Force a full reindex of the search index in Metabase |
| `reinit_search` | Re-initialize the search index in Metabase |

### Dataset/Query Tools (8)

| Tool | Description |
|------|-------------|
| `execute_query` | Execute an ad-hoc query |
| `export_query` | Export query results in various formats |
| `execute_query_pivot` | Execute a pivot query against a Metabase database |
| `get_native_query` | Convert an MBQL query to native SQL without executing it |
| `get_dataset_param_values` | Get values for a dataset parameter in Metabase |
| `search_dataset_param_values` | Search values for a dataset parameter in Metabase |
| `get_dataset_param_remapping` | Get remapping for a dataset parameter in Metabase |
| `get_dataset_query_metadata` | Get metadata for a dataset query in Metabase |

### User Tools (10)

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
| `get_user_recipients` | Get a list of users who are eligible to receive notifications and alerts in Metabase |
| `dismiss_user_modal` | Dismiss a modal for a user in Metabase |

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

### Revision Tools (3)

| Tool | Description |
|------|-------------|
| `list_revisions` | List revisions for an entity |
| `revert_revision` | Revert an entity to a previous revision |
| `get_entity_revision` | Get revision history for a specific entity by type and ID in Metabase |

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

### Task Tools (7)

| Tool | Description |
|------|-------------|
| `list_tasks` | List scheduled tasks |
| `get_task` | Get a task by ID |
| `get_task_info` | Get task scheduler info |
| `list_task_runs` | List recent task runs |
| `get_task_run` | Get a task run by ID |
| `list_unique_tasks` | List all unique task types |
| `get_task_run_entities` | Get entity types tracked by task runs in Metabase |

### Activity Tools (5)

| Tool | Description |
|------|-------------|
| `list_recent_views` | List recently viewed items |
| `list_recents` | List recent activity |
| `list_popular_items` | List popular items |
| `get_most_recently_viewed_dashboard` | Get the most recently viewed dashboard |
| `add_recent_activity` | Add an item to recent activity in Metabase |

### Login History Tools (1)

| Tool | Description |
|------|-------------|
| `get_login_history` | Get login history for the current user |

### Persist Tools (11)

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
| `unpersist_database_models` | Unpersist all persisted models for a database in Metabase |

### Channel Tools (5)

| Tool | Description |
|------|-------------|
| `list_channels` | List all notification channels |
| `get_channel` | Get a channel by ID |
| `create_channel` | Create a notification channel |
| `update_channel` | Update a notification channel |
| `test_channel` | Test a notification channel |

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

### Segment Tools (7)

| Tool | Description |
|------|-------------|
| `list_segments` | Get list of all segments |
| `get_segment` | Get a segment by ID |
| `create_segment` | Create a new segment |
| `update_segment` | Update an existing segment |
| `delete_segment` | Delete a segment |
| `get_segment_revisions` | Get revision history of a segment |
| `get_segment_related` | Get related items for a segment in Metabase |

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

### Slack Tools (3) `[Requires Metabase Pro]`

| Tool | Description |
|------|-------------|
| `update_slack_settings` | Update Slack integration settings |
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

### Embed Tools (20)

| Tool | Description |
|------|-------------|
| `get_embed_card` | Get an embedded card by JWT token from Metabase |
| `get_embed_card_query` | Get query results for an embedded card by JWT token from Metabase |
| `get_embed_card_query_format` | Get query results for an embedded card in a specific export format from Metabase |
| `get_embed_dashboard` | Get an embedded dashboard by JWT token from Metabase |
| `get_embed_dashboard_query` | Get query results for a dashcard in an embedded dashboard from Metabase |
| `get_embed_dashboard_params` | Get values for a parameter in an embedded dashboard from Metabase |
| `search_embed_dashboard_params` | Search parameter values for a parameter in an embedded dashboard from Metabase |
| `get_embed_card_param_values` | Get values for a parameter of an embedded card in Metabase |
| `search_embed_card_param_values` | Search values for a parameter of an embedded card in Metabase |
| `export_embed_card_query` | Export results of an embedded card query in Metabase |
| `get_embed_dashboard_param_values` | Get values for a parameter of an embedded dashboard in Metabase |
| `search_embed_dashboard_param_values` | Search values for a parameter of an embedded dashboard in Metabase |
| `run_embed_card_pivot_query` | Run a pivot query for an embedded card in Metabase |
| `get_embed_card_param_remapping` | Get remapping for a parameter of an embedded card in Metabase |
| `get_embed_dashboard_param_remapping` | Get remapping for a parameter of an embedded dashboard in Metabase |
| `run_embed_dashcard_query` | Run a query for an embedded dashcard in Metabase |
| `export_embed_dashcard_query` | Export results of an embedded dashcard query in Metabase |
| `run_embed_dashboard_pivot_dashcard_query` | Run a pivot query for an embedded dashboard dashcard in Metabase |
| `get_embed_card_tile` | Get a map tile for an embedded card in Metabase |
| `get_embed_dashboard_tile` | Get a map tile for an embedded dashboard dashcard in Metabase |

### Public Tools (27)

| Tool | Description |
|------|-------------|
| `get_public_card` | Get a publicly shared card by UUID from Metabase |
| `get_public_card_query` | Get query results for a publicly shared card by UUID from Metabase |
| `get_public_card_query_format` | Get query results for a publicly shared card in a specific export format from Metabase |
| `get_public_dashboard` | Get a publicly shared dashboard by UUID from Metabase |
| `get_public_dashboard_params` | Get values for a parameter in a publicly shared dashboard from Metabase |
| `search_public_dashboard_params` | Search parameter values for a parameter in a publicly shared dashboard from Metabase |
| `get_public_card_param_values` | Get values for a parameter of a public card in Metabase |
| `search_public_card_param_values` | Search values for a parameter of a public card in Metabase |
| `get_public_card_param_remapping` | Get remapping for a parameter of a public card in Metabase |
| `get_public_dashboard_param_values` | Get values for a parameter of a public dashboard in Metabase |
| `search_public_dashboard_param_values` | Search values for a parameter of a public dashboard in Metabase |
| `get_public_dashboard_param_remapping` | Get remapping for a parameter of a public dashboard in Metabase |
| `execute_public_action` | Execute a public action in Metabase |
| `execute_public_dashcard_action` | Execute an action on a public dashcard in Metabase |
| `run_public_card_pivot_query` | Run a pivot query for a public card in Metabase |
| `get_public_oembed` | Get oEmbed metadata for a public Metabase resource |
| `get_public_action` | Get details of a public action in Metabase |
| `export_public_card_query` | Export results of a public card query in Metabase |
| `get_public_dashcard_query` | Get query results for a public dashcard in Metabase |
| `export_public_dashcard_query` | Export results of a public dashcard query in Metabase |
| `run_public_dashboard_pivot_dashcard_query` | Run a pivot query for a public dashboard dashcard in Metabase |
| `get_public_card_tile` | Get a map tile for a public card in Metabase |
| `get_public_dashboard_tile` | Get a map tile for a public dashboard dashcard in Metabase |
| `get_public_document` | Get a publicly shared document by UUID from Metabase |
| `get_public_document_card` | Get a card from a publicly shared document by UUID in Metabase |
| `export_public_document_card` | Export a card from a publicly shared document in Metabase |
| `export_public_dashcard_query_format` | Export results of a public dashboard card query in a specific format in Metabase |

### Preview Embed Tools (15)

| Tool | Description |
|------|-------------|
| `preview_embed_card` | Preview an embedded card by token from Metabase (admin only) |
| `preview_embed_card_query` | Preview query results for an embedded card by token from Metabase (admin only) |
| `preview_embed_dashboard` | Preview an embedded dashboard by token from Metabase (admin only) |
| `preview_embed_dashboard_params` | Preview values for a parameter in an embedded dashboard from Metabase (admin only) |
| `get_preview_embed_card_param_values` | Get values for a parameter of a preview embedded card in Metabase |
| `get_preview_embed_dashboard_param_values` | Get values for a parameter of a preview embedded dashboard in Metabase |
| `search_preview_embed_dashboard_param_values` | Search values for a parameter of a preview embedded dashboard in Metabase |
| `run_preview_embed_card_pivot_query` | Run a pivot query for a preview embedded card in Metabase |
| `get_preview_embed_card_param_remapping` | Get remapping for a parameter of a preview embedded card in Metabase |
| `get_preview_embed_dashboard_param_remapping` | Get remapping for a parameter of a preview embedded dashboard in Metabase |
| `run_preview_embed_dashcard_query` | Run a query for a preview embedded dashcard in Metabase |
| `export_preview_embed_dashcard_query` | Export results of a preview embedded dashcard query in Metabase |
| `run_preview_embed_dashboard_pivot_dashcard_query` | Run a pivot query for a preview embedded dashboard dashcard in Metabase |
| `get_preview_embed_card_tile` | Get a map tile for a preview embedded card in Metabase |
| `get_preview_embed_dashboard_tile` | Get a map tile for a preview embedded dashboard dashcard in Metabase |

### Automagic Dashboard Tools (11)

| Tool | Description |
|------|-------------|
| `get_xray_entity` | Get an x-ray automagic dashboard for any entity in Metabase |
| `get_xray_database_candidates` | Get X-ray dashboard candidates for a database in Metabase |
| `get_xray_entity_cell` | Get an x-ray automagic dashboard for a specific cell of an entity in Metabase |
| `get_xray_entity_cell_compare` | Get a comparison x-ray automagic dashboard for a specific cell of an entity in Metabase |
| `get_xray_entity_cell_rule` | Get an x-ray automagic dashboard for a specific cell of an entity with a rule applied in Metabase |
| `get_xray_entity_cell_rule_compare` | Get a comparison x-ray automagic dashboard for a specific cell of an entity with a rule applied in Metabase |
| `get_xray_entity_compare` | Get a comparison x-ray automagic dashboard for an entity in Metabase |
| `get_xray_entity_query_metadata` | Get query metadata for an x-ray automagic dashboard entity in Metabase |
| `get_xray_entity_rule` | Get an x-ray automagic dashboard for an entity with a rule applied in Metabase |
| `get_xray_entity_rule_compare` | Get a comparison x-ray automagic dashboard for an entity with a rule applied in Metabase |
| `get_xray_model_index` | Get an x-ray automagic dashboard for a model index by primary key in Metabase |

### Comment Tools (6)

| Tool | Description |
|------|-------------|
| `list_comments` | List comments on a model |
| `create_comment` | Create a comment |
| `update_comment` | Update a comment |
| `delete_comment` | Delete a comment |
| `add_comment_reaction` | Add an emoji reaction to a comment |
| `get_comment_mentions` | Get comment mentions for the current user in Metabase |

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

### Tiles Tools (5)

| Tool | Description |
|------|-------------|
| `get_card_map_tile` | Get a map tile for a card with lat/lon fields |
| `get_table_map_tile` | Get a map tile for a table |
| `get_card_tile` | Get a map tile for a card in Metabase |
| `get_dashboard_tile` | Get a map tile for a dashboard card in Metabase |
| `get_basic_tile` | Get a basic map tile by zoom level and coordinates in Metabase |

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

### Alert Tools (3)

| Tool | Description |
|------|-------------|
| `list_alerts` | List all alerts in Metabase |
| `get_alert` | Get details of a specific alert in Metabase |
| `delete_alert_subscription` | Delete subscription to an alert in Metabase |

### Analytics Tools (1)

| Tool | Description |
|------|-------------|
| `get_analytics_stats` | Retrieve anonymous usage statistics from Metabase |

### Cards Bulk Tools (2)

| Tool | Description |
|------|-------------|
| `list_cards_in_dashboards` | Get dashboards that contain the specified cards in Metabase |
| `bulk_move_cards` | Move multiple cards to a collection in Metabase |

### Document Tools (10)

| Tool | Description |
|------|-------------|
| `list_documents` | List all documents in Metabase |
| `get_document` | Get a document by ID in Metabase |
| `create_document` | Create a new document in Metabase |
| `update_document` | Update a document by ID in Metabase |
| `delete_document` | Delete a document by ID in Metabase |
| `copy_document` | Copy a document by ID in Metabase |
| `create_document_public_link` | Create a public link for a document in Metabase |
| `delete_document_public_link` | Delete the public link for a document in Metabase |
| `export_document_card_query` | Export a card query result from a document in Metabase |
| `list_public_documents` | List all documents with public links in Metabase |

### Measure Tools (4)

| Tool | Description |
|------|-------------|
| `list_measures` | List all measures in Metabase |
| `get_measure` | Get a measure by ID in Metabase |
| `create_measure` | Create a new measure in Metabase |
| `update_measure` | Update a measure by ID in Metabase |

### Notify Tools (3)

| Tool | Description |
|------|-------------|
| `notify_database_sync` | Notify Metabase that a database has changed and trigger a sync by database ID |
| `notify_database_sync_by_name` | Notify Metabase that a database has changed and trigger a sync by engine and database name |
| `notify_new_database_table` | Notify Metabase of a new table in a database |

### Product Feedback Tools (1)

| Tool | Description |
|------|-------------|
| `submit_product_feedback` | Submit product feedback to Metabase |

### Pulse Tools (9)

| Tool | Description |
|------|-------------|
| `list_pulses` | List all pulses in Metabase |
| `get_pulse` | Get details of a specific pulse in Metabase |
| `create_pulse` | Create a new pulse in Metabase |
| `update_pulse` | Update a pulse in Metabase |
| `test_pulse` | Test a pulse by sending it immediately in Metabase |
| `get_pulse_form_input` | Get form input options for creating a pulse in Metabase |
| `unsubscribe_pulse` | Unsubscribe from a pulse in Metabase |
| `unsubscribe_pulse_email` | Unsubscribe from pulse email notifications in Metabase |
| `undo_pulse_unsubscribe` | Undo an email unsubscribe from a pulse in Metabase |

### Util Tools (1)

| Tool | Description |
|------|-------------|
| `generate_random_token` | Generate a random token in Metabase |

## Requirements

- Node.js 22+
- Metabase instance with API access (v0.49+)

## License

[MIT](LICENSE)
