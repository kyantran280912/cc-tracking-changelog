/**
 * Module để so sánh semantic versions
 */

import semver from 'semver';

/**
 * Kiểm tra xem version A có mới hơn version B không
 * @param versionA - Version cần check (ví dụ: "2.0.50")
 * @param versionB - Version để so sánh (ví dụ: "2.0.48")
 * @returns true nếu versionA > versionB
 */
export function isNewerVersion(versionA: string, versionB: string): boolean {
  try {
    return semver.gt(versionA, versionB);
  } catch (error) {
    console.error(`Error comparing versions: ${versionA} vs ${versionB}`, error);
    return false;
  }
}

/**
 * Kiểm tra xem version có hợp lệ không
 */
export function isValidVersion(version: string): boolean {
  return semver.valid(version) !== null;
}

/**
 * So sánh hai versions
 * @returns 1 nếu v1 > v2, -1 nếu v1 < v2, 0 nếu bằng nhau
 */
export function compareVersions(v1: string, v2: string): number {
  try {
    return semver.compare(v1, v2);
  } catch (error) {
    console.error(`Error comparing versions: ${v1} vs ${v2}`, error);
    return 0;
  }
}

/**
 * Format version string (clean và validate)
 */
export function cleanVersion(version: string): string | null {
  const cleaned = semver.clean(version);
  return cleaned;
}
