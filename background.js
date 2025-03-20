chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
      id: "highlightAndSave",
      title: "Highlight and Save Note",
      contexts: ["selection"]
    });
  });
  
  chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "highlightAndSave") {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: getSelectionAndSave
      });
    }
  });
  
  function getSelectionAndSave() {
    const selectedText = window.getSelection().toString();
    if (selectedText) {
      chrome.runtime.sendMessage({
        action: "saveNote",
        selection: selectedText,
        url: window.location.href
      });
    }
  }
  
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "saveNote") {
      chrome.storage.local.get({ notes: [], summaryHistory: [] }, (data) => {
        const newNote = {
          text: request.selection,
          url: request.url,
          timestamp: Date.now()
        };
        const updatedNotes = [...data.notes, newNote];
  
        // Calculate the overall summary
        let newSummary = "";
        updatedNotes.forEach(note => {
          newSummary += " " + note.text;
        });
        newSummary = newSummary.trim();
  
        // Add the overall summary to history
        const updatedHistory = [...data.summaryHistory, newSummary];
  
        chrome.storage.local.set({ notes: updatedNotes, summaryHistory: updatedHistory });
      });
    }
  });