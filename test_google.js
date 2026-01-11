const google = require('googlethis');

async function test() {
    console.log("Searching for PDF...");
    try {
        const options = {
            page: 0,
            safe: false, // Safe Search
            additional_params: {
                // add additional parameters here, see https://moz.com/blog/the-ultimate-guide-to-the-google-search-parameters and https://www.seoquake.com/blog/google-search-param/
                hl: 'id'
            }
        };

        // Search for 'belajar machine learning'
        const response = await google.search('belajar machine learning', options);

        console.log(`Found ${response.results.length} results.`);
        if (response.results.length > 0) {
            console.log("Top Result:", response.results[0]);
        }

    } catch (e) {
        console.error("Error:", e);
    }
}

test();
