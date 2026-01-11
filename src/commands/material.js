const materialService = require("../services/materialService");
const config = require("../config/config");

module.exports = (bot) => {
    bot.onText(/\/materi(?: (.+))?/, async (msg, match) => {
        const chatId = msg.chat.id;
        const query = match[1];

        if (!query) {
            return bot.sendMessage(chatId, "⚠️ Mohon sertakan topik materi.\nContoh: `/materi sistem operasi`", { parse_mode: "Markdown" });
        }

        bot.sendMessage(chatId, "🔍 *Sedang mencari file materi (PDF/PPT)...*", { parse_mode: "Markdown" });

        try {
            const materials = await materialService.searchMaterials(query);

            if (materials.length > 0) {
                let resultMessage = `📂 *Materi Kuliah: "${query}"*\n\n`;

                materials.forEach((item, index) => {
                    const icon = item.fileFormat && item.fileFormat.includes("PDF") ? "📄" : "📊";
                    resultMessage += `${index + 1}. ${icon} *[${item.title}](${item.link})*\n`;
                    if (item.description) {
                        // Clean up description (remove newlines usually found in snippets)
                        const cleanDesc = item.description.replace(/\n/g, " ").substring(0, 100) + "...";
                        resultMessage += `   _${cleanDesc}_\n`;
                    }
                    resultMessage += "\n";
                });

                bot.sendMessage(chatId, resultMessage, {
                    parse_mode: "Markdown",
                    disable_web_page_preview: true,
                });
            } else {
                bot.sendMessage(chatId, config.messages.notFoundMaterial(query) + "\n\nCoba tambahkan kata kunci spesifik.");
            }
        } catch (error) {
            console.error("Error fetching materials:", error.message);
            bot.sendMessage(chatId, "⚠️ Terjadi kesalahan saat mencari materi. Pastikan API Key sudah dikonfigurasi.");
        }
    });
};
