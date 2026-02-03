# @takeokunn/metabase-mcp

[![npm version](https://img.shields.io/npm/v/@takeokunn/metabase-mcp.svg)](https://www.npmjs.com/package/@takeokunn/metabase-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A Model Context Protocol (MCP) server for Metabase, enabling AI assistants to interact with your Metabase instance.

## Features

- **Database Management** - List, create, update, delete databases and sync metadata
- **Card/Question Management** - Create, execute, and manage saved questions
- **Dashboard Management** - Build and manage dashboards with cards
- **Collection Management** - Organize content in collections with tree navigation
- **Table Management** - Access table metadata and manage field visibility
- **Field Management** - Configure field metadata, semantic types, and values
- **User Management** - Create, update, and manage user accounts
- **Permissions Management** - Configure permission groups and data access
- **Search** - Full-text search across all Metabase content
- **Query Execution** - Run ad-hoc queries and export results
- **Secure API Token Authentication** - API key-based access control
- **TypeScript Implementation** - Full type safety throughout

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

This MCP server provides 67 tools organized into 10 categories:

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

### Dashboard Tools (7)

| Tool | Description |
|------|-------------|
| `list_dashboards` | List all dashboards |
| `get_dashboard` | Get dashboard details by ID |
| `get_dashboard_metadata` | Get dashboard metadata including cards |
| `create_dashboard` | Create a new dashboard |
| `update_dashboard` | Update an existing dashboard |
| `delete_dashboard` | Delete a dashboard |
| `copy_dashboard` | Copy a dashboard to a new location |

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

### Field Tools (8)

| Tool | Description |
|------|-------------|
| `get_field` | Get field details by ID |
| `update_field` | Update field properties (display name, semantic type, visibility) |
| `get_field_values` | Get cached values for a field |
| `update_field_values` | Update cached field values |
| `rescan_field_values` | Trigger a rescan of field values |
| `discard_field_values` | Discard cached field values |
| `get_field_related` | Get related fields and tables |
| `search_field_values` | Search for values within a field |

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

### Permissions Tools (9)

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

## Requirements

- Node.js 22+
- Metabase instance with API access

## License

[MIT](LICENSE)
