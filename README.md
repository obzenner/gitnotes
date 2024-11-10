### Git Hook Setup

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

To enable commit message validation, run the following command after cloning the repository:

```bash
npm run setup-hooks