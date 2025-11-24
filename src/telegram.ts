/**
 * Module để gửi thông báo qua Telegram bot
 */

import { Telegraf } from 'telegraf';

const CHANGELOG_URL = 'https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md';

export interface NotificationConfig {
  botToken: string;
  chatId: string;
}

/**
 * Format message markdown cho Telegram
 * Dùng Markdown (không phải V2) để tránh phức tạp với escape characters
 */
function formatMessage(version: string, entries: string[]): string {
  const header = `📢 *Claude Code v${version} Released!*\n`;

  let changeList = '\n🎉 *Changelog:*\n';

  if (entries.length > 0) {
    // Limit to 15 entries để tránh message quá dài
    const displayEntries = entries.slice(0, 15);
    displayEntries.forEach(entry => {
      changeList += `• ${entry}\n`;
    });

    if (entries.length > 15) {
      changeList += `\n_... và ${entries.length - 15} thay đổi khác_\n`;
    }
  } else {
    changeList += '• _No changelog entries found_\n';
  }

  const footer = `\n🔗 [View Full Changelog](${CHANGELOG_URL})`;

  return header + changeList + footer;
}

/**
 * Gửi thông báo qua Telegram
 */
export async function sendNotification(
  config: NotificationConfig,
  version: string,
  entries: string[]
): Promise<void> {
  try {
    const bot = new Telegraf(config.botToken);
    const message = formatMessage(version, entries);

    await bot.telegram.sendMessage(config.chatId, message, {
      parse_mode: 'Markdown'
    });

    console.log(`✅ Telegram notification sent for version ${version}`);
  } catch (error) {
    console.error('❌ Error sending Telegram notification:', error);
    throw error;
  }
}

/**
 * Test connection với Telegram bot
 */
export async function testBotConnection(botToken: string): Promise<boolean> {
  try {
    const bot = new Telegraf(botToken);
    const botInfo = await bot.telegram.getMe();
    console.log(`✅ Bot connected: @${botInfo.username}`);
    return true;
  } catch (error) {
    console.error('❌ Failed to connect to Telegram bot:', error);
    return false;
  }
}
