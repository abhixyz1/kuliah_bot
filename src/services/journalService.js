const axios = require("axios");
const config = require("../config/config");

const searchJournals = async (query) => {
    try {
        // Switch to OpenAlex API (Free, no key required for basic use)
        const response = await axios.get(
            `https://api.openalex.org/works`,
            {
                params: {
                    search: query,
                    per_page: 5,
                },
                timeout: config.timeout,
                headers: {
                    // Good practice for OpenAlex
                    'User-Agent': 'KuliahBot/1.0 (mailto:student@example.com)'
                }
            }
        );

        if (response.data && response.data.results && response.data.results.length > 0) {
            return response.data.results.map((work) => ({
                title: work.title || "Tanpa Judul",
                authors: work.authorships ? work.authorships.map(a => a.author.display_name) : [],
                year: work.publication_year,
                // OpenAlex provides open access URL if available
                downloadUrl: work.open_access && work.open_access.is_oa ? work.open_access.oa_url : null,
                url: work.doi ? work.doi : (work.ids ? work.ids.landing_page_url : null),
            }));
        }
        return [];
    } catch (error) {
        if (error.response) {
            throw new Error(`API Error: ${error.response.status}`);
        }
        throw new Error(error.message);
    }
};

module.exports = {
    searchJournals,
};
