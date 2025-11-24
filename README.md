# Claude Code Changelog Tracker 🤖

Script TypeScript tự động theo dõi CHANGELOG của Claude Code và gửi thông báo qua Telegram khi có phiên bản mới được phát hành.

## ✨ Tính Năng

- 🔄 Tự động check changelog từ [Claude Code GitHub](https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md)
- 📊 So sánh semantic versions để phát hiện version mới
- 📱 Gửi thông báo đầy đủ changelog qua Telegram
- ⏰ Scheduler tích hợp (node-cron) - check mỗi 1 giờ (có thể custom)
- 💾 Lưu trữ state đơn giản qua JSON file
- 🚀 Nhẹ, dễ deploy (local hoặc cloud free tier)

## 📋 Yêu Cầu

- Node.js >= 18.x
- npm hoặc yarn
- Telegram account và bot token (miễn phí)

## 🚀 Cài Đặt

### 1. Clone/Download project

```bash
cd tracking-changelog-cc
```

### 2. Cài đặt dependencies

```bash
npm install
```

### 3. Setup Telegram Bot

#### Bước 1: Tạo bot với BotFather

1. Mở Telegram và tìm [@BotFather](https://t.me/BotFather)
2. Gửi lệnh `/newbot`
3. Đặt tên cho bot (ví dụ: "Claude Code Tracker")
4. Đặt username (phải kết thúc bằng `bot`, ví dụ: `claudecode_tracker_bot`)
5. **Copy Bot Token** mà BotFather gửi cho bạn (dạng: `1234567890:ABCdefGHIjklMNOpqrsTUVwxyz`)

#### Bước 2: Lấy Chat ID

**Cách 1: Dùng userinfobot**
1. Tìm [@userinfobot](https://t.me/userinfobot) trên Telegram
2. Start bot và nó sẽ gửi cho bạn Chat ID

**Cách 2: Dùng getidsbot**
1. Tìm [@getidsbot](https://t.me/getidsbot) trên Telegram
2. Start bot và nó sẽ hiển thị Chat ID của bạn

**Cách 3: Thủ công**
1. Gửi một tin nhắn bất kỳ cho bot của bạn
2. Mở trình duyệt và truy cập:
   ```
   https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates
   ```
3. Tìm `"chat":{"id":123456789}` trong response

### 4. Cấu hình Environment Variables

Tạo file `.env` từ template:

```bash
cp .env.example .env
```

Sau đó edit file `.env` và điền thông tin:

```env
TELEGRAM_BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrsTUVwxyz
TELEGRAM_CHAT_ID=123456789
CHECK_INTERVAL_HOURS=1
```

## 🎯 Sử Dụng

### Chạy với scheduler (recommended)

Script sẽ check changelog định kỳ mỗi N giờ (theo `CHECK_INTERVAL_HOURS`):

```bash
npm start
```

Hoặc development mode (auto-reload khi code thay đổi):

```bash
npm run dev
```

### Check một lần (không scheduler)

Chỉ check và thông báo một lần, sau đó exit:

```bash
npm run check
```

### Build TypeScript (optional)

Compile TypeScript sang JavaScript:

```bash
npm run build
```

Sau đó chạy:

```bash
node dist/index.js
```

## 📁 Cấu Trúc Project

```
tracking-changelog-cc/
├── src/
│   ├── index.ts          # Main entry point + scheduler
│   ├── changelog.ts      # Fetch & parse CHANGELOG từ GitHub
│   ├── version.ts        # So sánh semantic versions
│   ├── storage.ts        # Quản lý state.json
│   └── telegram.ts       # Gửi thông báo Telegram
├── state.json            # Lưu last checked version (auto-generated)
├── .env                  # Environment variables (create from .env.example)
├── .env.example          # Template
├── package.json          # Dependencies
├── tsconfig.json         # TypeScript config
└── README.md             # Documentation
```

## 🔧 Configuration

### Environment Variables

| Variable | Mô tả | Mặc định |
|----------|-------|---------|
| `TELEGRAM_BOT_TOKEN` | Bot token từ BotFather | **Required** |
| `TELEGRAM_CHAT_ID` | Chat ID để nhận thông báo | **Required** |
| `CHECK_INTERVAL_HOURS` | Số giờ giữa mỗi lần check | `1` |

### Thay đổi tần suất check

Edit file `.env`:

```env
# Check mỗi 30 phút (0.5 giờ) - không khuyến nghị vì quá thường xuyên
CHECK_INTERVAL_HOURS=0.5

# Check mỗi 1 giờ (recommended)
CHECK_INTERVAL_HOURS=1

# Check mỗi 6 giờ
CHECK_INTERVAL_HOURS=6

# Check mỗi 12 giờ
CHECK_INTERVAL_HOURS=12

# Check mỗi ngày
CHECK_INTERVAL_HOURS=24
```

**Lưu ý:** Với `CHECK_INTERVAL_HOURS` dưới 1 giờ, cron expression sẽ chuyển sang check mỗi giờ. Để check thường xuyên hơn, bạn có thể modify code trong `src/index.ts`.

## 📱 Format Thông Báo

Khi có version mới, bạn sẽ nhận được thông báo qua Telegram với format:

```
📢 Claude Code v2.0.50 Released!

🎉 Changelog:
• Fixed bug preventing calling MCP tools
• Improved error handling
• [other changes...]

🔗 View Full Changelog
```

## 🚢 Deployment Options (FREE)

### Option 1: Local Machine (24/7)

Chạy script trên máy tính cá nhân (cần để máy bật liên tục):

```bash
npm start
```

### Option 2: Railway.app (FREE - 500 hours/month)

1. Tạo tài khoản tại [Railway.app](https://railway.app/)
2. Tạo New Project → Deploy from GitHub
3. Add environment variables trong Railway dashboard
4. Deploy

### Option 3: Render.com (FREE - Background Worker)

1. Tạo tài khoản tại [Render.com](https://render.com/)
2. New → Background Worker
3. Connect GitHub repository
4. Build command: `npm install`
5. Start command: `npm start`
6. Add environment variables
7. Deploy

### Option 4: Oracle Cloud Always Free Tier

1. Tạo VM instance (Always Free tier)
2. SSH vào server
3. Cài Node.js
4. Clone project và setup
5. Dùng PM2 hoặc systemd để chạy liên tục

```bash
# Cài PM2
npm install -g pm2

# Start với PM2
pm2 start npm --name "claude-tracker" -- start

# Save PM2 config
pm2 save

# Setup auto-start
pm2 startup
```

### Option 5: Fly.io (Recommended - ~$3-4/tháng)

**Tại sao chọn Fly.io:**
- Đơn giản, reliable
- Multi-region deployment
- Built-in health checks
- Graceful shutdown tự động
- Logs và monitoring tốt

#### Prerequisites

1. **Install flyctl CLI:**
   ```bash
   # macOS
   brew install flyctl

   # Linux
   curl -L https://fly.io/install.sh | sh

   # Windows
   pwsh -Command "iwr https://fly.io/install.ps1 -useb | iex"
   ```

2. **Login vào Fly.io:**
   ```bash
   flyctl auth login
   ```

#### Deployment Steps

**Bước 1: Launch app lần đầu**

```bash
# Từ root directory của project
flyctl launch

# Trả lời các câu hỏi:
# - App name: (để tự động hoặc đặt tên riêng)
# - Choose organization: (chọn org của bạn)
# - Choose region: sin (Singapore) hoặc region gần bạn
# - Would you like to set up PostgreSQL? NO
# - Would you like to set up Redis? NO
# - Would you like to deploy now? NO (chưa deploy, cần set secrets trước)
```

**Bước 2: Set environment secrets**

```bash
flyctl secrets set TELEGRAM_BOT_TOKEN="your_token_from_botfather"
flyctl secrets set TELEGRAM_CHAT_ID="your_chat_id"
flyctl secrets set CHECK_INTERVAL_HOURS="1"
```

**Bước 3: Build và deploy**

```bash
# Build TypeScript trước
npm run build

# Deploy lên Fly.io
flyctl deploy

# Xem logs real-time
flyctl logs
```

**Bước 4: Verify deployment**

```bash
# Check status
flyctl status

# Check health
flyctl checks list

# Xem logs
flyctl logs --app your-app-name
```

#### Update app sau này

Khi có code thay đổi, chỉ cần:

```bash
npm run build
flyctl deploy
```

Fly.io sẽ tự động:
- Build Docker image mới
- Deploy với zero-downtime
- Graceful shutdown version cũ
- Health check version mới

#### Monitoring & Debug

```bash
# Xem logs real-time
flyctl logs

# SSH vào machine (nếu cần debug)
flyctl ssh console

# Xem resource usage
flyctl status

# List secrets đã set
flyctl secrets list

# Restart app
flyctl apps restart
```

#### Cost Estimate

Với cấu hình trong `fly.toml` (256MB RAM, shared CPU):

```
Compute:  ~$2.32/tháng (730 giờ × $0.0000008/s × 3600s)
Bandwidth: ~$1/tháng (estimate)
---
Total: ~$3-4/tháng
```

**Tiết kiệm chi phí:**
- Sử dụng shared CPU (không cần dedicated)
- Set memory = 256MB (đủ cho bot nhỏ)
- Chỉ chạy 1 machine (`min_machines_running = 1`)

#### Troubleshooting Fly.io

**Health check failed:**
```bash
# Kiểm tra logs
flyctl logs

# Verify endpoint /health
flyctl ssh console
curl localhost:3000/health
```

**Out of memory:**
```bash
# Scale up memory trong fly.toml
[[vm]]
  memory = "512mb"  # tăng từ 256MB

# Deploy lại
flyctl deploy
```

**App không start:**
```bash
# Check secrets đã set chưa
flyctl secrets list

# Xem logs chi tiết
flyctl logs --app your-app-name
```

## 🐛 Troubleshooting

### Bot không gửi thông báo

1. Kiểm tra `TELEGRAM_BOT_TOKEN` có đúng không
2. Kiểm tra `TELEGRAM_CHAT_ID` có đúng không
3. Đảm bảo bạn đã gửi `/start` cho bot trên Telegram
4. Check logs để xem lỗi chi tiết

### State file không được tạo

- Kiểm tra quyền write trong thư mục project
- Xem logs để xem lỗi chi tiết

### "No new version found" mãi

- Xóa file `state.json` để reset
- Chạy lại `npm run check`

### TypeError: fetch is not defined

- Cập nhật Node.js lên version >= 18
- Hoặc cài thêm `node-fetch` package

## 📝 License

MIT

## 👨‍💻 Contributing

Pull requests are welcome! For major changes, please open an issue first.

## 🔗 Links

- [Claude Code GitHub](https://github.com/anthropics/claude-code)
- [Claude Code CHANGELOG](https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md)
- [Telegram Bot API](https://core.telegram.org/bots/api)

---

Made with ❤️ for Claude Code community
