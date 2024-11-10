// scripts/generateNotes.js
const { execSync } = require("child_process");
const fs = require("fs");

// Load allowed categories and file types from JSON config
const config = JSON.parse(fs.readFileSync("./scripts/commit-config.json", "utf-8"));
const { allowedCategories, allowedFileTypes } = config;

// Build regex pattern for category:file-type format
const categoryPattern = allowedCategories.join("|");
const fileTypePattern = allowedFileTypes.join("|");
const commitRegex = new RegExp(`^(${categoryPattern}):(${fileTypePattern}): (.+)`);

function getCommits() {
  // Get commit messages and their associated markdown files
  const rawLog = execSync(
    'git log --pretty=format:"%H|%s|%cd" --date=iso --name-only -- "*.md"'
  ).toString();

  const commits = [];
  let currentCommit = null;

  rawLog.split("\n").forEach((line) => {
    if (line.includes("|")) {
      // New commit entry
      const [hash, message, date] = line.split("|");

      // Filter commits based on the allowed category:file-type format
      const match = commitRegex.exec(message);
      if (!match) {
        currentCommit = null;  // Reset currentCommit if it doesn't match the allowed pattern
        return;  // Skip this commit if it doesn't match the allowed pattern
      }

      const [, category, fileType, title] = match;
      currentCommit = { hash, message, date, category, fileType, title, content: "" };
      commits.push(currentCommit);
    } else if (line.endsWith(".md") && currentCommit) {
      // Markdown file associated with the current commit
      try {
        const content = execSync(`git show ${currentCommit.hash}:${line}`).toString();
        currentCommit.content = content;
      } catch (error) {
        console.error(`Error fetching file content: ${error}`);
      }
    }
  });

  return commits;
}

function saveCommitsToFile(commits) {
  fs.writeFileSync("./src/public/commits.json", JSON.stringify(commits, null, 2));
}

const commits = getCommits();
saveCommitsToFile(commits);
console.log("Commits and content saved to src/public/commits.json");