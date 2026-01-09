const yts = require('yt-search');

/**
 * Mencari video di YouTube berdasarkan query
 * @param {string} query - Kata kunci pencarian
 * @returns {Promise<Array>} List video yang ditemukan
 */
async function searchVideos(query) {
    try {
        const r = await yts(query);
        // Ambil video saja (filter playlist/channel) dan batasi 5 hasil
        const videos = r.videos.slice(0, 5).map(v => ({
            title: v.title,
            url: v.url,
            timestamp: v.timestamp,
            thumbnail: v.thumbnail,
            author: v.author.name,
            ago: v.ago // waktu upload (misal: 2 years ago)
        }));

        return videos;
    } catch (error) {
        console.error("Error searching videos:", error);
        throw error;
    }
}

module.exports = {
    searchVideos
};
