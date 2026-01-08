require("dotenv").config();

module.exports = {
    telegramToken: process.env.TELEGRAM_BOT_TOKEN,
    coreApiBaseUrl: "https://core.ac.uk/api-v2/search/",
    wikipediaApiUrl: "https://en.wikipedia.org/w/api.php",
    timeout: 10000,
    messages: {
        welcome: `
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
`,
        help: `
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
`,
        searchingJournal: "🔍 Mencari jurnal ilmiah...",
        searchingMaterial: "🔍 Mencari materi kuliah...",
        searchingVideo: "🔍 Mencari video pembelajaran...",
        errorGeneric: "⚠️ Terjadi kesalahan. Silakan coba lagi nanti.",
        notFoundJournal: (query) => `❌ Tidak ditemukan jurnal dengan kata kunci "${query}". Coba kata kunci lain!`,
        notFoundMaterial: (query) => `❌ Tidak ditemukan materi dengan topik "${query}". Coba kata kunci lain!`,
    },
};
