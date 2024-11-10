// scripts/generateNotes.js
const { execSync } = require("child_process");
const fs = require("fs");

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
      currentCommit = { hash, message, date, content: "" };
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
  fs.writeFileSync("public/commits.json", JSON.stringify(commits, null, 2));
}

const commits = getCommits();
saveCommitsToFile(commits);
console.log("Commits and content saved to public/commits.json");