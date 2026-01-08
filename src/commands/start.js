const config = require("../config/config");

module.exports = (bot) => {
    bot.onText(/\/start/, (msg) => {
        const chatId = msg.chat.id;
        bot.sendMessage(chatId, config.messages.welcome, { parse_mode: "Markdown" });
    });
};
