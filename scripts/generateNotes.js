const fs = require("fs");
const path = require("path");
const chalk = require('chalk');

// Load allowed categories and file types from JSON config
const config = JSON.parse(fs.readFileSync("./scripts/commit-config.json", "utf-8"));
const { allowedCategories, allowedFileTypes } = config;

// Directory containing markdown files
const mdDirectory = "./src/md";

// Function to parse filename based on category:file-type:title.md pattern
function parseFilename(filename) {
  const [category, fileType, titleWithExt] = filename.split(":");
  const title = titleWithExt.replace(".md", "");

  // Check if category and fileType are allowed
  if (!allowedCategories.includes(category) || !allowedFileTypes.includes(fileType)) {
    console.error(chalk.red(`Invalid category or file type:`));
    console.error(chalk.yellow(`Category: ${category}`));
    console.error(chalk.yellow(`File Type: ${fileType}`));
    console.error(chalk.green(`Allowed Categories: ${allowedCategories.join(", ")}`));
    console.error(chalk.green(`Allowed File Types: ${allowedFileTypes.join(", ")}`));
    throw new Error(`Invalid category or file type: ${category} ${fileType}`);
  }

  return { category, fileType, title };
}

// Function to get data from markdown files in the directory
function getCommitsFromFiles() {
  const notes = [];

  fs.readdirSync(mdDirectory).forEach((file) => {
    if (path.extname(file) === ".md") {
      const parsed = parseFilename(file);

      if (parsed) {
        const { category, fileType, title } = parsed;
        const filePath = path.join(mdDirectory, file);
        const content = fs.readFileSync(filePath, "utf-8");

        notes.push({
          date: fs.statSync(filePath).mtime.toISOString(), // Last modified date
          category,
          fileType,
          title,
          content,
        });
      }
    }
  });

  return notes;
}

// Save the data to commits.json
function saveCommitsToFile(notes) {
  fs.writeFileSync("./src/public/notes.json", JSON.stringify(notes, null, 2));
}

// Generate commits.json from files
const notes = getCommitsFromFiles();
saveCommitsToFile(notes);
console.log("Notes and content saved to src/public/notes.json");