const axios = require("axios");
const config = require("../config/config");

const searchMaterials = async (query) => {
    try {
        if (!config.googleApiKey || !config.googleCseId) {
            throw new Error("API Key atau CSE ID belum dikonfigurasi.");
        }

        const response = await axios.get("https://www.googleapis.com/customsearch/v1", {
            params: {
                key: config.googleApiKey,
                cx: config.googleCseId,
                q: `${query} filetype:pdf OR filetype:ppt`, // Force PDF or PPT
                num: 5 // Limit 5 results
            },
            timeout: config.timeout,
        });

        if (response.data.items && response.data.items.length > 0) {
            return response.data.items.map(item => ({
                title: item.title,
                description: item.snippet,
                link: item.link,
                fileFormat: item.fileFormat // "PDF/Adobe Acrobat" usually
            }));
        }
        return [];
    } catch (error) {
        console.error("Error searching materials:", error.message);
        throw new Error(error.message);
    }
};

module.exports = {
    searchMaterials,
};
