const config = require("../config/config");
const videoService = require("../services/videoService");

module.exports = (bot) => {
    bot.onText(/\/video(?: (.+))?/, async (msg, match) => {
        const chatId = msg.chat.id;
        const query = match[1];

        if (!query) {
            return bot.sendMessage(chatId, "⚠️ Mohon sertakan topik video.\nContoh: `/video struktur data`", { parse_mode: "Markdown" });
        }

        bot.sendMessage(chatId, "🔍 *Sedang mencari video...*", { parse_mode: "Markdown" });

        try {
            const videos = await videoService.searchVideos(query);

            if (videos.length > 0) {
                const mainVideo = videos[0];

                // Kirim Video Utama dengan Thumbnail
                const caption = `🎥 *${mainVideo.title}*\n\n` +
                    `👤 Channel: ${mainVideo.author}\n` +
                    `⏱ Durasi: ${mainVideo.timestamp} (${mainVideo.ago})\n` +
                    `🔗 [Tonton Video](${mainVideo.url})`;

                await bot.sendPhoto(chatId, mainVideo.thumbnail, {
                    caption: caption,
                    parse_mode: "Markdown"
                });

                // Kirim Rekomendasi Lainnya jika ada
                if (videos.length > 1) {
                    let recommendationMsg = "*Rekomendasi Lainnya:*\n";
                    videos.slice(1).forEach((v, i) => {
                        recommendationMsg += `\n${i + 1}. [${v.title}](${v.url}) - ${v.timestamp}`;
                    });

                    await bot.sendMessage(chatId, recommendationMsg, {
                        parse_mode: "Markdown",
                        disable_web_page_preview: true
                    });
                }

            } else {
                bot.sendMessage(chatId, "⚠️ Maaf, tidak ditemukan video untuk topik tersebut.");
            }

        } catch (error) {
            console.error("Error searching video:", error);
            // Fallback ke pesan manual jika error
            const youtubeSearchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
            bot.sendMessage(chatId, `⚠️ Terjadi kesalahan. Cari manual di:\n[YouTube](${youtubeSearchUrl})`, { parse_mode: "Markdown" });
        }
    });
};
