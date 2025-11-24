/**
 * Claude Code Changelog Tracker
 * Main entry point với node-cron scheduler
 */

import dotenv from 'dotenv';
import cron from 'node-cron';
import { getLatestVersionInfo } from './changelog.js';
import { isNewerVersion } from './version.js';
import { getLastCheckedVersion, updateLastCheckedVersion } from './storage.js';
import { sendNotification, testBotConnection } from './telegram.js';

// Load environment variables
dotenv.config();

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';
const CHAT_ID = process.env.TELEGRAM_CHAT_ID || '';
const CHECK_INTERVAL_HOURS = parseInt(process.env.CHECK_INTERVAL_HOURS || '1', 10);

// Validate environment variables
function validateConfig(): boolean {
  if (!BOT_TOKEN) {
    console.error('❌ TELEGRAM_BOT_TOKEN is not set in .env file');
    return false;
  }

  if (!CHAT_ID) {
    console.error('❌ TELEGRAM_CHAT_ID is not set in .env file');
    return false;
  }

  return true;
}

/**
 * Main logic để check changelog và gửi notification nếu có version mới
 */
async function checkAndNotify(): Promise<void> {
  try {
    console.log('\n🔍 Checking Claude Code changelog...');

    // Fetch latest version info
    const versionInfo = await getLatestVersionInfo();

    if (!versionInfo) {
      console.log('⚠️  Could not fetch version information');
      return;
    }

    console.log(`📌 Latest version found: ${versionInfo.version}`);

    // Get last checked version from state
    const lastCheckedVersion = await getLastCheckedVersion();

    if (!lastCheckedVersion) {
      console.log('ℹ️  First time running, saving current version as baseline');
      await updateLastCheckedVersion(versionInfo.version);
      console.log(`✅ Baseline set to version ${versionInfo.version}`);
      return;
    }

    console.log(`📌 Last checked version: ${lastCheckedVersion}`);

    // Compare versions
    if (isNewerVersion(versionInfo.version, lastCheckedVersion)) {
      console.log(`🎉 NEW VERSION DETECTED: ${versionInfo.version} (previous: ${lastCheckedVersion})`);
      console.log(`📝 Found ${versionInfo.entries.length} changelog entries`);

      // Send Telegram notification
      await sendNotification(
        {
          botToken: BOT_TOKEN,
          chatId: CHAT_ID
        },
        versionInfo.version,
        versionInfo.entries
      );

      // Update state with new version
      await updateLastCheckedVersion(versionInfo.version);
      console.log(`✅ State updated to version ${versionInfo.version}`);
    } else {
      console.log('✨ No new version found');
    }
  } catch (error) {
    console.error('❌ Error in checkAndNotify:', error);
  }
}

/**
 * Main function
 */
async function main() {
  console.log('🚀 Claude Code Changelog Tracker started');
  console.log(`⏰ Check interval: every ${CHECK_INTERVAL_HOURS} hour(s)`);

  // Validate config
  if (!validateConfig()) {
    console.error('❌ Configuration validation failed. Please check your .env file');
    process.exit(1);
  }

  // Test bot connection
  console.log('🔌 Testing Telegram bot connection...');
  const isConnected = await testBotConnection(BOT_TOKEN);

  if (!isConnected) {
    console.error('❌ Failed to connect to Telegram bot. Please check your TELEGRAM_BOT_TOKEN');
    process.exit(1);
  }

  // Check if running with --once flag
  const isOnceMode = process.argv.includes('--once');

  if (isOnceMode) {
    console.log('🔄 Running in one-time check mode (--once)');
    await checkAndNotify();
    console.log('✅ One-time check completed');
    process.exit(0);
  }

  // Run first check immediately
  console.log('🔄 Running initial check...');
  await checkAndNotify();

  // Setup cron schedule
  // Format: minute hour day month weekday
  const cronExpression = `0 */${CHECK_INTERVAL_HOURS} * * *`; // Every N hours

  console.log(`\n⏰ Scheduler started with cron: ${cronExpression}`);
  console.log('Press Ctrl+C to stop\n');

  cron.schedule(cronExpression, async () => {
    console.log(`\n⏰ Scheduled check triggered at ${new Date().toLocaleString()}`);
    await checkAndNotify();
  });
}

// Start the application
main().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
