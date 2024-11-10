async function loadNotes() {
  // Fetch categories from commit-config.json
  const configResponse = await fetch("commit-config.json");
  const config = await configResponse.json();
  const availableCategories = config.allowedCategories;

  // Clone and create filter container
  createCategoryFilter(availableCategories);

  // Fetch notes data
  const response = await fetch("public/notes.json");
  const commits = await response.json();

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

  // Render notes based on selected categories
  function renderNotes(selectedCategories) {
    const notesContainer = document.getElementById("notesContainer");
    notesContainer.innerHTML = ""; // Clear current notes

    for (const [category, notes] of Object.entries(groupedNotes)) {
      if (!selectedCategories.includes(category)) continue; // Skip unselected categories

      // Clone and populate category template
      const categoryTemplate = document.getElementById("categoryTemplate").content;
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
        const noteTemplate = document.getElementById("noteTemplate").content;
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

  // Create filter UI for categories with "Deselect All" functionality
  function createCategoryFilter(categories) {
    const filterContainerTemplate = document.getElementById("filterContainerTemplate").content;
    const filterContainer = document.importNode(filterContainerTemplate, true);
    const filterOptions = filterContainer.querySelector(".filter-options");
    const toggleSelectButton = filterContainer.querySelector("#toggleSelectButton");

    // Event listener for the Deselect/Select All button
    toggleSelectButton.addEventListener("click", () => {
      const checkboxes = filterOptions.querySelectorAll("input[type='checkbox']");
      const allSelected = Array.from(checkboxes).every(checkbox => checkbox.checked);
      checkboxes.forEach(checkbox => checkbox.checked = !allSelected);
      
      const selectedCategories = Array.from(
        filterOptions.querySelectorAll("input[type='checkbox']:checked")
      ).map(checkbox => checkbox.value);

      // Update button text based on selection
      toggleSelectButton.textContent = allSelected ? "Select All" : "Deselect All";

      renderNotes(selectedCategories);
    });

    // Create checkboxes for each category
    categories.forEach((category) => {
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.id = category;
      checkbox.value = category;
      checkbox.checked = true; // Check all by default

      const label = document.createElement("label");
      label.htmlFor = category;
      label.textContent = category;

      checkbox.addEventListener("change", () => {
        const selectedCategories = Array.from(
          filterOptions.querySelectorAll("input[type='checkbox']:checked")
        ).map(checkbox => checkbox.value);

        renderNotes(selectedCategories);

        // Update button text based on selection state
        const allSelected = selectedCategories.length === categories.length;
        toggleSelectButton.textContent = allSelected ? "Deselect All" : "Select All";
      });

      filterOptions.appendChild(checkbox);
      filterOptions.appendChild(label);
    });

    // Append the filter container to the body
    document.body.insertBefore(filterContainer, document.getElementById("notesContainer"));
  }

  // Initially render all notes
  const initialCategories = availableCategories; // Show all categories initially
  renderNotes(initialCategories);
}

// Call the loadNotes function
loadNotes();