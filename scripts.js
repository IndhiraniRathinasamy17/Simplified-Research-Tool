document.addEventListener("DOMContentLoaded", () => {
    loadNotes();
  
    const showSummaryBtn = document.getElementById("show-summary-btn");
    showSummaryBtn.addEventListener("click", () => {
      loadOverallSummary();
      document.getElementById("overall-summary-container").style.display = "block";
      document.getElementById("summary-history-container").style.display = "none";
    });
  
    const showHistoryBtn = document.getElementById("show-history-btn");
    showHistoryBtn.addEventListener("click", () => {
      loadSummaryHistory();
      document.getElementById("summary-history-container").style.display = "block";
      document.getElementById("overall-summary-container").style.display = "none";
    });
  });
  
  function loadOverallSummary() {
    chrome.storage.local.get({ notes: [] }, (data) => {
      let overallSummary = "";
      data.notes.forEach(note => {
        overallSummary += " " + note.text;
      });
      overallSummary = overallSummary.trim();
  
      const overallSummaryContainer = document.getElementById("overall-summary-container");
      overallSummaryContainer.innerHTML = `<h2>Overall Summary:</h2><p>${overallSummary}</p>`;
    });
  }
  
  function loadSummaryHistory() {
    chrome.storage.local.get({ summaryHistory: [] }, (data) => {
      const summaryHistoryContainer = document.getElementById("summary-history-container");
      summaryHistoryContainer.innerHTML = `<h2>Summary History:</h2>`;
      data.summaryHistory.forEach((summary, index) => {
        summaryHistoryContainer.innerHTML += `<p><strong>Summary ${index + 1}:</strong> ${summary}</p>`;
      });
    });
  }
  
  function loadNotes() {
    chrome.storage.local.get({ notes: [] }, (data) => {
      const notesContainer = document.getElementById("notes-container");
      notesContainer.innerHTML = "";
      data.notes.forEach((note, index) => {
        const noteElement = document.createElement("div");
        noteElement.innerHTML = `
          <p><strong>${note.text}</strong></p>
          <p>URL: <a href="${note.url}" target="_blank">${note.url}</a></p>
          <button class="delete-note" data-index="${index}">Delete</button>
          <hr>
        `;
        notesContainer.appendChild(noteElement);
      });
  
      document.querySelectorAll(".delete-note").forEach((button) => {
        button.addEventListener("click", () => {
          const index = parseInt(button.dataset.index);
          deleteNote(index);
        });
      });
    });
  }
  
  function deleteNote(index) {
    chrome.storage.local.get({ notes: [], summaryHistory: [] }, (data) => {
      const updatedNotes = data.notes.filter((_, i) => i !== index);
  
      // Reconstruct the overall summary
      let newSummary = "";
      updatedNotes.forEach(note => {
        newSummary += " " + note.text;
      });
      newSummary = newSummary.trim();
  
      // Add the overall summary to history
      const updatedHistory = [...data.summaryHistory, newSummary];
  
      chrome.storage.local.set({ notes: updatedNotes, summaryHistory: updatedHistory }, () => {
        loadNotes();
      });
    });
  }