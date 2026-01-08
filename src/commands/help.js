const config = require("../config/config");

module.exports = (bot) => {
    bot.onText(/\/help/, (msg) => {
        const chatId = msg.chat.id;
        bot.sendMessage(chatId, config.messages.help, { parse_mode: "Markdown" });
    });
};
