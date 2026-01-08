const config = require("../config/config");

module.exports = (bot) => {
    bot.onText(/\/video(?: (.+))?/, async (msg, match) => {
        const chatId = msg.chat.id;
        const query = match[1];

        if (!query) {
            return bot.sendMessage(chatId, "⚠️ Mohon sertakan topik video.\nContoh: `/video struktur data`", { parse_mode: "Markdown" });
        }

        bot.sendMessage(chatId, config.messages.searchingVideo);

        const youtubeSearchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(query + " tutorial")}`;
        const youtubeEduSearchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(query + " lecture")}`;

        const resultMessage = `
🎥 *Video Pembelajaran: "${query}"*

Silakan cari video di platform berikut:

🔴 [YouTube - Tutorial](${youtubeSearchUrl})
🔴 [YouTube - Lecture](${youtubeEduSearchUrl})

*Channel Rekomendasi:*
• Programmer Zaman Now (Indonesia)
• Web Programming UNPAS (Indonesia)
• freeCodeCamp
• Traversy Media
• The Net Ninja

💡 *Tips:* Tambahkan kata kunci "tutorial" atau "explained" untuk hasil lebih baik!
`;

        bot.sendMessage(chatId, resultMessage, {
            parse_mode: "Markdown",
            disable_web_page_preview: false,
        });
    });
};
