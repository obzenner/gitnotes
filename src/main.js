// src/main.js
async function loadNotes() {
  const response = await fetch("public/commits.json");
  const commits = await response.json();

  const notesContainer = document.getElementById("notesContainer");
  const noteTemplate = document.getElementById("noteTemplate").content;
  const categoryTemplate = document.getElementById("categoryTemplate").content;

  // Function to convert basic Markdown to HTML
  function parseMarkdown(content) {
    return content
      .replace(/^# (.+)/gm, "<strong>$1</strong>")        // Header level 1
      .replace(/^## (.+)/gm, "<em>$1</em>")               // Header level 2
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")   // Bold text
      .replace(/\[(.+?)\]\((https?:\/\/[^\s]+)\)/g, '<a href="$2" target="_blank">$1</a>'); // Links
  }

  // Group notes by category
  const groupedNotes = commits.reduce((acc, commit) => {
    const { category } = commit;
    if (!acc[category]) acc[category] = [];
    acc[category].push(commit);
    return acc;
  }, {});

  // Render grouped notes
  for (const [category, notes] of Object.entries(groupedNotes)) {
    // Clone and populate category template
    const categoryElement = document.importNode(categoryTemplate, true);
    const categoryHeader = categoryElement.querySelector(".category-header");
    categoryHeader.textContent = category;

    // Apply category-specific background color class
    categoryElement.querySelector(".category-section").classList.add(
      category.toLowerCase() || "default-category"
    );

    const notesList = categoryElement.querySelector(".notes-list");

    notes.forEach((note) => {
      const { title, date, content, fileType } = note;

      // Clone the note template and populate it
      const noteElement = document.importNode(noteTemplate, true);
      noteElement.querySelector(".note-title").textContent = title;
      noteElement.querySelector(".note-date").textContent = date;

      // Add file type as a tag
      const fileTypeTag = noteElement.querySelector(".file-type-tag");
      fileTypeTag.textContent = fileType;
      fileTypeTag.classList.add(fileType.toLowerCase() || "default-file-type");

      // Convert and insert parsed Markdown as HTML
      const parsedContent = parseMarkdown(content);
      noteElement.querySelector(".note-content").innerHTML = parsedContent;

      // Append the populated note to the notes list for this category
      notesList.appendChild(noteElement);
    });

    // Append the populated category section to the main container
    notesContainer.appendChild(categoryElement);
  }
}

loadNotes();