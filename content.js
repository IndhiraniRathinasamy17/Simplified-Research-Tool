chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "highlight") {
      const selection = window.getSelection();
      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const highlight = document.createElement("span");
        highlight.style.backgroundColor = "yellow";
        range.surroundContents(highlight);
      }
    }
  });