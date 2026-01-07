require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");

const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

console.log("🤖 Bot is running...");

// Command: /start
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const welcomeMessage = `
🎓 *Selamat datang di Kuliah Bot!*

Bot ini membantu Anda mencari:
📚 Jurnal ilmiah
📖 Materi kuliah
🎥 Video pembelajaran

*Cara Penggunaan:*
/jurnal <kata kunci> - Cari jurnal ilmiah
/materi <topik> - Cari materi kuliah
/video <topik> - Cari video pembelajaran
/help - Bantuan lengkap
`;

  bot.sendMessage(chatId, welcomeMessage, { parse_mode: "Markdown" });
});

// Command: /help
bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;
  const helpMessage = `
📖 *Panduan Penggunaan Bot*

*Perintah yang tersedia:*

1️⃣ */jurnal <kata kunci>*
   Contoh: /jurnal machine learning
   Mencari jurnal ilmiah dari berbagai sumber

2️⃣ */materi <topik>*
   Contoh: /materi algoritma pemrograman
   Mencari materi kuliah dan tutorial

3️⃣ */video <topik>*
   Contoh: /video struktur data
   Mencari video pembelajaran dari YouTube

*Tips Pencarian:*
• Gunakan kata kunci spesifik
• Gunakan bahasa Inggris untuk hasil lebih banyak
• Kombinasikan beberapa kata kunci

Butuh bantuan? Hubungi developer!
`;

  bot.sendMessage(chatId, helpMessage, { parse_mode: "Markdown" });
});

// Command: /jurnal - Pencarian jurnal ilmiah menggunakan CORE API
bot.onText(/\/jurnal (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const query = match[1];

  bot.sendMessage(chatId, "🔍 Mencari jurnal ilmiah...");

  try {
    // Menggunakan CORE API (gratis, tidak perlu API key untuk pencarian basic)
    const response = await axios.get(
      `https://core.ac.uk/api-v2/search/${encodeURIComponent(query)}`,
      {
        params: {
          page: 1,
          pageSize: 5,
        },
        timeout: 10000,
      }
    );

    if (response.data && response.data.data && response.data.data.length > 0) {
      let resultMessage = `📚 *Hasil Pencarian Jurnal: "${query}"*\n\n`;

      response.data.data.slice(0, 5).forEach((paper, index) => {
        resultMessage += `${index + 1}. *${paper.title || "Tanpa Judul"}*\n`;
        if (paper.authors && paper.authors.length > 0) {
          resultMessage += `   👤 ${paper.authors.join(", ")}\n`;
        }
        if (paper.year) {
          resultMessage += `   📅 ${paper.year}\n`;
        }
        if (paper.downloadUrl) {
          resultMessage += `   🔗 [Download PDF](${paper.downloadUrl})\n`;
        } else if (paper.urls && paper.urls.length > 0) {
          resultMessage += `   🔗 [Lihat Detail](${paper.urls[0]})\n`;
        }
        resultMessage += "\n";
      });

      bot.sendMessage(chatId, resultMessage, {
        parse_mode: "Markdown",
        disable_web_page_preview: true,
      });
    } else {
      bot.sendMessage(
        chatId,
        `❌ Tidak ditemukan jurnal dengan kata kunci "${query}". Coba kata kunci lain!`
      );
    }
  } catch (error) {
    console.error("Error fetching journals:", error.message);

    // Fallback: Gunakan Google Scholar link
    const scholarUrl = `https://scholar.google.com/scholar?q=${encodeURIComponent(
      query
    )}`;
    bot.sendMessage(
      chatId,
      `⚠️ Terjadi kesalahan saat mengakses database jurnal.\n\n` +
        `Silakan cari manual di:\n🔗 [Google Scholar](${scholarUrl})`,
      { parse_mode: "Markdown" }
    );
  }
});

// Command: /materi - Pencarian materi kuliah
bot.onText(/\/materi (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const query = match[1];

  bot.sendMessage(chatId, "🔍 Mencari materi kuliah...");

  try {
    // Menggunakan Wikipedia API untuk materi umum
    const response = await axios.get("https://en.wikipedia.org/w/api.php", {
      params: {
        action: "opensearch",
        search: query,
        limit: 5,
        format: "json",
      },
      timeout: 10000,
    });

    if (response.data && response.data[1] && response.data[1].length > 0) {
      const titles = response.data[1];
      const descriptions = response.data[2];
      const links = response.data[3];

      let resultMessage = `📖 *Hasil Pencarian Materi: "${query}"*\n\n`;

      for (let i = 0; i < titles.length; i++) {
        resultMessage += `${i + 1}. *${titles[i]}*\n`;
        if (descriptions[i]) {
          resultMessage += `   ${descriptions[i]}\n`;
        }
        resultMessage += `   🔗 [Baca Selengkapnya](${links[i]})\n\n`;
      }

      // Tambahkan sumber alternatif
      resultMessage += `\n*Sumber Lain:*\n`;
      resultMessage += `📚 [MIT OpenCourseWare](https://ocw.mit.edu/search/?q=${encodeURIComponent(
        query
      )})\n`;
      resultMessage += `📚 [Khan Academy](https://www.khanacademy.org/search?search_again=1&page_search_query=${encodeURIComponent(
        query
      )})\n`;

      bot.sendMessage(chatId, resultMessage, {
        parse_mode: "Markdown",
        disable_web_page_preview: true,
      });
    } else {
      bot.sendMessage(
        chatId,
        `❌ Tidak ditemukan materi dengan topik "${query}". Coba kata kunci lain!`
      );
    }
  } catch (error) {
    console.error("Error fetching materials:", error.message);
    bot.sendMessage(chatId, "⚠️ Terjadi kesalahan. Silakan coba lagi nanti.");
  }
});

// Command: /video - Pencarian video pembelajaran
bot.onText(/\/video (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const query = match[1];

  bot.sendMessage(chatId, "🔍 Mencari video pembelajaran...");

  // Karena YouTube API memerlukan API key, kita akan memberikan link pencarian langsung
  const youtubeSearchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(
    query + " tutorial"
  )}`;
  const youtubeEduSearchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(
    query + " lecture"
  )}`;

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

// Handle pesan biasa (bukan command)
bot.on("message", (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  // Ignore jika sudah berupa command
  if (text && text.startsWith("/")) {
    return;
  }

  // Response untuk pesan biasa
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

// Error handling
bot.on("polling_error", (error) => {
  console.error("Polling error:", error.message);
});

process.on("unhandledRejection", (error) => {
  console.error("Unhandled rejection:", error);
});
