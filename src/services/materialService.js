const axios = require("axios");
const config = require("../config/config");

const searchMaterials = async (query) => {
    try {
        const response = await axios.get(config.wikipediaApiUrl, {
            params: {
                action: "opensearch",
                search: query,
                limit: 5,
                format: "json",
            },
            timeout: config.timeout,
            headers: {
                // Wikipedia requires a User-Agent
                'User-Agent': 'KuliahBot/1.0 (mailto:student@example.com)'
            }
        });

        if (response.data && response.data[1] && response.data[1].length > 0) {
            const titles = response.data[1];
            const descriptions = response.data[2];
            const links = response.data[3];

            const results = [];
            for (let i = 0; i < titles.length; i++) {
                results.push({
                    title: titles[i],
                    description: descriptions[i],
                    link: links[i]
                });
            }
            return results;
        }
        return [];
    } catch (error) {
        throw new Error(error.message);
    }
};

module.exports = {
    searchMaterials,
};
