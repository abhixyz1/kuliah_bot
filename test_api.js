const axios = require("axios");

const testJournalApi = async () => {
    console.log("--- Testing Journal API (CORE) ---");
    const query = "machine learning";
    const url = `https://core.ac.uk/api-v2/search/${encodeURIComponent(query)}?page=1&pageSize=5`;

    try {
        const start = Date.now();
        const response = await axios.get(url, { timeout: 10000 });
        const end = Date.now();
        console.log(`Status: ${response.status} (${end - start}ms)`);
        if (response.data && response.data.data) {
            console.log(`Found ${response.data.data.length} results.`);
        } else {
            console.log("Structure unexpected:", Object.keys(response.data));
        }
    } catch (error) {
        console.error("Error:", error.message);
        if (error.response) {
            console.error("Response Status:", error.response.status);
            console.error("Response Data:", error.response.data);
        }
    }
};

const testMaterialApi = async () => {
    console.log("\n--- Testing Material API (Wikipedia) ---");
    const query = "machine learning";
    const url = "https://en.wikipedia.org/w/api.php";

    try {
        const start = Date.now();
        const response = await axios.get(url, {
            params: {
                action: "opensearch",
                search: query,
                limit: 5,
                format: "json",
            },
            timeout: 10000,
        });
        const end = Date.now();
        console.log(`Status: ${response.status} (${end - start}ms)`);
        console.log("Data:", JSON.stringify(response.data).substring(0, 100) + "...");
    } catch (error) {
        console.error("Error:", error.message);
    }
};

(async () => {
    await testJournalApi();
    await testMaterialApi();
})();
