# metabase-mcp

A Model Context Protocol (MCP) server for Metabase, enabling AI assistants to interact with your Metabase instance.

## Features

- List all connected databases in Metabase
- Secure API token authentication
- TypeScript implementation with full type safety

## Installation

```bash
pnpm install
pnpm build
```

## Configuration

Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

Required environment variables:

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

### Direct Execution

```bash
export METABASE_URL=https://your-metabase.example.com
export METABASE_API_TOKEN=mb_your_api_token
pnpm start
```

### Claude Desktop Integration

Add to your Claude Desktop configuration (`~/Library/Application Support/Claude/claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "metabase": {
      "command": "node",
      "args": ["/path/to/metabase-mcp/dist/index.js"],
      "env": {
        "METABASE_URL": "https://metabase.example.com",
        "METABASE_API_TOKEN": "mb_your_api_token"
      }
    }
  }
}
```

## Available Tools

### `get_databases`

Lists all databases connected to your Metabase instance.

**Parameters:** None

**Returns:** Array of database objects with `id`, `name`, and `engine` properties.

## Development

```bash
# Install dependencies
pnpm install

# Build
pnpm build

# Run tests
pnpm test

# Watch mode
pnpm dev
```

## Requirements

- Node.js 22+
- pnpm
- Metabase instance with API access

## License

MIT
