require('dotenv').config(); // Load env
const materialService = require('./src/services/materialService');

async function test() {
    console.log("Testing Material Service (Google CSE)...");
    try {
        const results = await materialService.searchMaterials("sistem operasi");
        console.log(`Found ${results.length} results.`);

        if (results.length > 0) {
            console.log("Top Result:", results[0]);
        }
    } catch (e) {
        console.error("Test Failed:", e.message);
        if (e.response && e.response.data) {
            console.error("Error Details:", JSON.stringify(e.response.data, null, 2));
        }
    }
}

test();
