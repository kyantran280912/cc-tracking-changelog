/**
 * Module để quản lý state (last checked version) trong state.json
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to state.json (ở root của project)
const STATE_FILE = path.join(__dirname, '..', 'state.json');

export interface State {
  lastCheckedVersion: string | null;
  lastCheckTime: string;
}

/**
 * Đọc state từ state.json
 * Nếu file không tồn tại, return state mặc định
 */
export async function readState(): Promise<State> {
  try {
    const data = await fs.readFile(STATE_FILE, 'utf-8');
    const state = JSON.parse(data) as State;
    return state;
  } catch (error) {
    // Nếu file không tồn tại hoặc invalid JSON, return default state
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      console.log('State file not found, using default state');
      return {
        lastCheckedVersion: null,
        lastCheckTime: new Date().toISOString()
      };
    }

    console.error('Error reading state file:', error);
    // Return default state nếu có lỗi
    return {
      lastCheckedVersion: null,
      lastCheckTime: new Date().toISOString()
    };
  }
}

/**
 * Ghi state vào state.json
 */
export async function writeState(state: State): Promise<void> {
  try {
    const data = JSON.stringify(state, null, 2);
    await fs.writeFile(STATE_FILE, data, 'utf-8');
    console.log(`State saved: version ${state.lastCheckedVersion} at ${state.lastCheckTime}`);
  } catch (error) {
    console.error('Error writing state file:', error);
    throw error;
  }
}

/**
 * Update last checked version
 */
export async function updateLastCheckedVersion(version: string): Promise<void> {
  const state: State = {
    lastCheckedVersion: version,
    lastCheckTime: new Date().toISOString()
  };

  await writeState(state);
}

/**
 * Lấy version đã check lần cuối
 */
export async function getLastCheckedVersion(): Promise<string | null> {
  const state = await readState();
  return state.lastCheckedVersion;
}
