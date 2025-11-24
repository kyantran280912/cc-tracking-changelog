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
 */
function formatMessage(version: string, entries: string[]): string {
  const header = `📢 *Claude Code v${version} Released!*\n`;

  let changeList = '\n🎉 *Changelog:*\n';

  if (entries.length > 0) {
    // Limit to 20 entries để tránh message quá dài
    const displayEntries = entries.slice(0, 20);
    displayEntries.forEach(entry => {
      // Escape markdown special characters
      const escapedEntry = entry
        .replace(/\[/g, '\\[')
        .replace(/\]/g, '\\]')
        .replace(/\(/g, '\\(')
        .replace(/\)/g, '\\)')
        .replace(/~/g, '\\~')
        .replace(/`/g, '\\`')
        .replace(/>/g, '\\>')
        .replace(/#/g, '\\#')
        .replace(/\+/g, '\\+')
        .replace(/-/g, '\\-')
        .replace(/=/g, '\\=')
        .replace(/\|/g, '\\|')
        .replace(/\{/g, '\\{')
        .replace(/\}/g, '\\}')
        .replace(/\./g, '\\.')
        .replace(/!/g, '\\!');

      changeList += `• ${escapedEntry}\n`;
    });

    if (entries.length > 20) {
      changeList += `\n_\\.\\.\\. và ${entries.length - 20} thay đổi khác_\n`;
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
      parse_mode: 'MarkdownV2',
      disable_web_page_preview: false,
      link_preview_options: {
        is_disabled: false,
        prefer_large_media: false
      }
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
