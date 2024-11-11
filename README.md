# Git Notes

A simple note-taking app that leverages Git commit messages and markdown files to organize and display notes in a terminal-inspired UI. This project uses GitHub Pages for deployment and GitHub Actions for automated deployment.

## Features

- **Categorized Notes**: Notes are organized by categories specified in `commit-config.json`.
- **Filter by Category**: Users can filter displayed notes by category using a styled checkbox filter UI.
- **Markdown Parsing**: Supports basic markdown syntax, converting headers, bold text, and links to HTML.
- **Dynamic "Select/Deselect All" Button**: Quickly select or deselect all categories.
- **Dark Terminal Theme**: Styled with a dark background and terminal-like font to give a minimalistic and clean look.

## Config File

The `src/commit-config.json` file contains the allowed categories and file types for commit messages. This file is used to validate commit messages and categorize notes. The default configuration is as follows:

```json
{
    "allowedCategories": [
        "ai", "web", "backend", "frontend", "data", "cloud", "infra", "security",
        "ml", "dl", "music", "art", "literature", "culture", "video", "gaming",
        "podcast", "film", "design", "devops", "blockchain", "ux", "ui", "dx",
        "opensource", "edtech", "fintech"
    ],
    "allowedFileTypes": [
        "courses", "notes", "projects", "tutorials", "guides", "articles",
        "research", "blog", "podcast", "track", "album", "playlist", "interview",
        "review", "summary", "report", "tool", "framework", "service", "architecture",
        "experiment", "feature", "issue", "refactor", "release", "fix", "chore",
        "doc", "event", "show", "exhibit", "book", "movie", "genre", "history",
        "concept", "technique", "video"
    ]
}
```

## Workflow
### Generator

1. **Add Note**: Add a new note by creating a markdown file in the `src/md` directory with a commit message that includes a category and file type (i.e. `ai:courses:some-course.md`).
2. **Generate Note**: Use the following command to generate a note:
    ```bash
    npm run md <url> <category> <filetype>
    ```
    Example:
    ```bash
    npm run md https://www.youtube.com/watch\?v\=7ySVWcFHz98 programming report
    ```
3. **Build or Start**: Run `npm run build` or `npm run start` to update the `public/notes.json` with the updated notes.
4. **Commit and Push**: Commit the new note and push to the repository.
5. **GitHub Actions**: The GitHub Actions workflow will run and deploy the updated notes to GitHub Pages.

### Manual
1. **Add Note**: Add a new note by creating a markdown file in the `src/md` directory with a commit message that includes a category and file type (i.e. ai:courses:some-course.md)
2. Run `npm run build` or `npm run start` to update the `public/notes.json` with the updated notes.
3. **Commit and Push**: Commit the new note and push to the repository.
4. **GitHub Actions**: The GitHub Actions workflow will run and deploy the updated notes to GitHub Pages.

## Commit Message Validation

To enable commit message validation, run the following command after cloning the repository:

```bash
npm run setup-hooks