const TelegramBot = require("node-telegram-bot-api");
const config = require("./src/config/config");

// Initialize Bot
const bot = new TelegramBot(config.telegramToken, { polling: true });

console.log("🤖 Kuliah Bot is running...");

// Register Commands
require("./src/commands/start")(bot);
require("./src/commands/help")(bot);
require("./src/commands/journal")(bot);
require("./src/commands/material")(bot);
require("./src/commands/video")(bot);

// Global Message Handler (for non-command messages)
bot.on("message", (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  // Ignore if it's a command
  if (text && text.startsWith("/")) {
    return;
  }

  // Response for normal messages
  if (text) {
    bot.sendMessage(
      chatId,
      "👋 Halo! Gunakan perintah berikut untuk mencari:\n\n" +
      "/jurnal <kata kunci> - Cari jurnal\n" +
      "/materi <topik> - Cari materi\n" +
      "/video <topik> - Cari video\n" +
      "/help - Bantuan lengkap"
    );
  }
});

// Error Handling
bot.on("polling_error", (error) => {
  console.error("Polling error:", error.message);
});

process.on("unhandledRejection", (error) => {
  console.error("Unhandled rejection:", error);
});
