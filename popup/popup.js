// Inject the send_links.js script into the current tab after the popout has loaded
window.onload = function() {
  document.getElementById('downloadButton').onclick = downloadFiles;
};

// Download all visible checked links.
function downloadFiles() {
chrome.windows.getCurrent(function (currentWindow) {
  chrome.tabs.query({active: true, windowId: currentWindow.id},
      function(activeTabs) {
        chrome.tabs.executeScript(
            activeTabs[0].id, {file: 'download.js', allFrames: true});
        chrome.tabs.sendMessage(activeTabs[0].id, {hello: "Cissy"}, function(response) {
          console.log(response.farewell);
        });
      });
});
}
