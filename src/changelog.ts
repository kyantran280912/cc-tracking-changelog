/**
 * Module để fetch và parse CHANGELOG từ Claude Code GitHub repository
 */

const CHANGELOG_URL = 'https://raw.githubusercontent.com/anthropics/claude-code/main/CHANGELOG.md';
const VERSION_PATTERN = /^## (\d+\.\d+\.\d+)$/gm;

export interface VersionInfo {
  version: string;
  entries: string[];
}

/**
 * Fetch CHANGELOG.md từ GitHub
 */
export async function fetchChangelog(): Promise<string> {
  try {
    const response = await fetch(CHANGELOG_URL);

    if (!response.ok) {
      throw new Error(`Failed to fetch changelog: ${response.status} ${response.statusText}`);
    }

    const text = await response.text();
    return text;
  } catch (error) {
    throw new Error(`Error fetching changelog: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Parse tất cả versions từ CHANGELOG markdown
 * @returns Array of version strings, sorted newest first
 */
export function extractVersions(markdown: string): string[] {
  const matches = Array.from(markdown.matchAll(VERSION_PATTERN));
  return matches.map(m => m[1]);
}

/**
 * Lấy version mới nhất từ CHANGELOG
 */
export function getLatestVersion(markdown: string): string | null {
  const versions = extractVersions(markdown);
  return versions.length > 0 ? versions[0] : null;
}

/**
 * Extract chi tiết changelog entries cho một version cụ thể
 */
export function extractVersionDetails(markdown: string, version: string): string[] {
  const versionHeader = `## ${version}`;
  const headerIndex = markdown.indexOf(versionHeader);

  if (headerIndex === -1) {
    return [];
  }

  // Tìm section tiếp theo (version kế tiếp hoặc end of file)
  const nextHeaderIndex = markdown.indexOf('\n## ', headerIndex + 1);
  const versionSection = nextHeaderIndex === -1
    ? markdown.slice(headerIndex)
    : markdown.slice(headerIndex, nextHeaderIndex);

  // Extract entries (lines starting with -)
  const entryPattern = /^- (.+)$/gm;
  const matches = Array.from(versionSection.matchAll(entryPattern));

  return matches.map(m => m[1].trim());
}

/**
 * Lấy thông tin đầy đủ về version mới nhất
 */
export async function getLatestVersionInfo(): Promise<VersionInfo | null> {
  const markdown = await fetchChangelog();
  const latestVersion = getLatestVersion(markdown);

  if (!latestVersion) {
    return null;
  }

  const entries = extractVersionDetails(markdown, latestVersion);

  return {
    version: latestVersion,
    entries
  };
}
