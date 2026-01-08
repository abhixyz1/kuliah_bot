const journalService = require("../services/journalService");
const config = require("../config/config");

module.exports = (bot) => {
    bot.onText(/\/jurnal(?: (.+))?/, async (msg, match) => {
        const chatId = msg.chat.id;
        const query = match[1];

        if (!query) {
            return bot.sendMessage(chatId, "⚠️ Mohon sertakan kata kunci.\nContoh: `/jurnal machine learning`", { parse_mode: "Markdown" });
        }

        bot.sendMessage(chatId, config.messages.searchingJournal);

        try {
            const journals = await journalService.searchJournals(query);

            if (journals.length > 0) {
                let resultMessage = `📚 *Hasil Pencarian Jurnal: "${query}"*\n\n`;

                journals.forEach((paper, index) => {
                    resultMessage += `${index + 1}. *${paper.title}*\n`;
                    if (paper.authors.length > 0) {
                        resultMessage += `   👤 ${paper.authors.join(", ")}\n`;
                    }
                    if (paper.year) {
                        resultMessage += `   📅 ${paper.year}\n`;
                    }
                    if (paper.downloadUrl) {
                        resultMessage += `   🔗 [Download PDF](${paper.downloadUrl})\n`;
                    } else if (paper.url) {
                        resultMessage += `   🔗 [Lihat Detail](${paper.url})\n`;
                    }
                    resultMessage += "\n";
                });

                bot.sendMessage(chatId, resultMessage, {
                    parse_mode: "Markdown",
                    disable_web_page_preview: true,
                });
            } else {
                bot.sendMessage(chatId, config.messages.notFoundJournal(query));
            }
        } catch (error) {
            console.error("Error fetching journals:", error.message);
            // Fallback to Google Scholar
            const scholarUrl = `https://scholar.google.com/scholar?q=${encodeURIComponent(query)}`;
            bot.sendMessage(
                chatId,
                `⚠️ Terjadi kesalahan saat mengakses database jurnal.\n\nSilakan cari manual di:\n🔗 [Google Scholar](${scholarUrl})`,
                { parse_mode: "Markdown" }
            );
        }
    });
};
