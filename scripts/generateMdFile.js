const axios = require("axios");
const fs = require("fs");
const OpenAI = require("openai");
const path = require("path");
const metascraper = require("metascraper")([
    require("metascraper-title")(),
    require("metascraper-description")(),
    require("metascraper-image")(),
    require("metascraper-url")()
]);


// Load configuration
const config = JSON.parse(fs.readFileSync("./src/commit-config.json", "utf-8"));
const { allowedCategories, allowedFileTypes } = config;

// Initialize OpenAI client
const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Validates the provided category and file type against allowed values in the config.
 * @param {string} category - The category to validate.
 * @param {string} fileType - The file type to validate.
 * @throws Will throw an error if the category or file type is invalid.
 */
function validateInputs(category, fileType) {
    if (!allowedCategories.includes(category)) throw new Error(`Invalid category: ${category}`);
    if (!allowedFileTypes.includes(fileType)) throw new Error(`Invalid file type: ${fileType}`);
}

async function fetchData(url) {
    try {
        const { data: html } = await axios.get(url);
        const metadata = await metascraper({ html, url });

        return {
            title: metadata.title || "No Title Available",
            description: metadata.description || "No Description Available",
            image: metadata.image || "No Image Available",
            url: metadata.url || url
        };
    } catch (error) {
        console.error("Failed to fetch data:", error.message);
        return null;
    }
}

async function createMarkdownFile(url, category, fileType) {
    validateInputs(category, fileType);
    const metadata = await fetchData(url);

    if (!metadata) {
        console.log("Failed to fetch metadata; aborting.");
        return;
    }

    // Sanitize the title and construct the filename
    const sanitizedTitle = metadata.title.replace(/[\/\\]/g, "").toLowerCase().replace(/\s+/g, "-");
    const filename = `${category}:${fileType}:${sanitizedTitle}.md`;
    const filePath = path.join("./src/md", filename);

    // Prepare the markdown content
    const markdownContent = `
**Title:** ${metadata.title}

**Link:** [${category}](${url})

**Content**

${metadata.description}

[${sanitizedTitle}](${url})
`;

    // Write to file
    fs.writeFileSync(filePath, markdownContent.trim());
    console.log(`Markdown file created at ${filePath}`);
}

// Example Usage
const url = process.argv[2];
const category = process.argv[3];
const fileType = process.argv[4];

if (!url || !category || !fileType) {
    console.log("Usage: node script.js <url> <category> <fileType>");
    process.exit(1);
}

createMarkdownFile(url, category, fileType);