import type { MetabaseClient } from './client.js';

/**
 * Structured representation of a Metabase version
 */
export interface MetabaseVersion {
  tag: string;
  major: number;
  minor: number;
  patch: number;
}

/**
 * Partial interface for Metabase session properties response
 * Contains only the fields needed for version detection
 */
export interface SessionProperties {
  version: {
    tag: string;
  };
}

/**
 * Parse a version tag string into a structured MetabaseVersion object
 * @param tag - Version tag like "v0.50.0" or "0.50.0"
 * @returns Structured version object
 * @throws Error if version tag format is invalid
 */
export function parseVersion(tag: string): MetabaseVersion {
  const normalizedTag = tag.startsWith('v') ? tag : `v${tag}`;
  const versionPart = tag.startsWith('v') ? tag.slice(1) : tag;

  const match = versionPart.match(/^(\d+)\.(\d+)\.(\d+)/);
  if (!match) {
    throw new Error(`Invalid version tag format: ${tag}`);
  }

  const [, majorStr, minorStr, patchStr] = match;
  return {
    tag: normalizedTag,
    major: Number.parseInt(majorStr, 10),
    minor: Number.parseInt(minorStr, 10),
    patch: Number.parseInt(patchStr, 10),
  };
}

/**
 * Compare two MetabaseVersion objects
 * @param a - First version
 * @param b - Second version
 * @returns -1 if a < b, 0 if equal, 1 if a > b
 */
export function compareVersions(a: MetabaseVersion, b: MetabaseVersion): number {
  if (a.major !== b.major) {
    return a.major < b.major ? -1 : 1;
  }
  if (a.minor !== b.minor) {
    return a.minor < b.minor ? -1 : 1;
  }
  if (a.patch !== b.patch) {
    return a.patch < b.patch ? -1 : 1;
  }
  return 0;
}

/**
 * Check if current version meets minimum required version
 * @param current - Current Metabase version
 * @param required - Required version string (e.g., "v0.50.0" or "0.50.0")
 * @returns true if current version is at least the required version
 */
export function isVersionAtLeast(current: MetabaseVersion, required: string): boolean {
  const requiredVersion = parseVersion(required);
  return compareVersions(current, requiredVersion) >= 0;
}

/**
 * Fetch and parse Metabase version from the server
 * @param client - MetabaseClient instance
 * @returns Parsed MetabaseVersion object
 */
export async function getMetabaseVersion(client: MetabaseClient): Promise<MetabaseVersion> {
  const properties = await client.get<SessionProperties>('/api/session/properties');
  return parseVersion(properties.version.tag);
}
