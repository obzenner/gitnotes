// src/main.js
async function loadNotes() {
    const response = await fetch("commits.json");
    const commits = await response.json();
    
    const canvas = document.getElementById("notesCanvas");
    const ctx = canvas.getContext("2d");
  
    const blockWidth = 150, blockHeight = 100;
    let x = 10, y = 10;
  
    commits.forEach((commit, index) => {
      const { message, date, content } = commit;
      const isStale = message.includes("stale:yes");
  
      // Draw background rectangle
      ctx.fillStyle = isStale ? "#ddd" : "#f0f8ff";
      ctx.fillRect(x, y, blockWidth, blockHeight);
  
      // Draw text
      ctx.fillStyle = "#000";
      ctx.font = "12px Arial";
      ctx.fillText(message.split(" ")[0] + ":", x + 10, y + 20);
      ctx.fillText(message.split(" ").slice(1).join(" "), x + 10, y + 40);
      ctx.fillText(date, x + 10, y + 60);
  
      // Render content preview
      const preview = content.slice(0, 50);  // Display first 50 characters
      ctx.fillText(preview, x + 10, y + 80);
  
      x += blockWidth + 10;
      if (x + blockWidth > canvas.width) {
        x = 10;
        y += blockHeight + 10;
      }
    });
  }
  
  loadNotes();