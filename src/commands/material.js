const materialService = require("../services/materialService");
const config = require("../config/config");

module.exports = (bot) => {
    bot.onText(/\/materi(?: (.+))?/, async (msg, match) => {
        const chatId = msg.chat.id;
        const query = match[1];

        if (!query) {
            return bot.sendMessage(chatId, "⚠️ Mohon sertakan topik materi.\nContoh: `/materi algoritma`", { parse_mode: "Markdown" });
        }

        bot.sendMessage(chatId, config.messages.searchingMaterial);

        try {
            const materials = await materialService.searchMaterials(query);

            if (materials.length > 0) {
                let resultMessage = `📖 *Hasil Pencarian Materi: "${query}"*\n\n`;

                materials.forEach((item, index) => {
                    resultMessage += `${index + 1}. *${item.title}*\n`;
                    if (item.description) {
                        resultMessage += `   ${item.description}\n`;
                    }
                    resultMessage += `   🔗 [Baca Selengkapnya](${item.link})\n\n`;
                });

                // Add alternative sources
                resultMessage += `\n*Sumber Lain:*\n`;
                resultMessage += `📚 [MIT OpenCourseWare](https://ocw.mit.edu/search/?q=${encodeURIComponent(query)})\n`;
                resultMessage += `📚 [Khan Academy](https://www.khanacademy.org/search?search_again=1&page_search_query=${encodeURIComponent(query)})\n`;

                bot.sendMessage(chatId, resultMessage, {
                    parse_mode: "Markdown",
                    disable_web_page_preview: true,
                });
            } else {
                bot.sendMessage(chatId, config.messages.notFoundMaterial(query));
            }
        } catch (error) {
            console.error("Error fetching materials:", error.message);
            bot.sendMessage(chatId, config.messages.errorGeneric);
        }
    });
};
