var visibleLinks = [];
var allLinks = [];

// Inject the send_links.js script into the current tab after the popout has loaded
window.onload = function() {
  document.getElementById('toggleAllCheckBox').onchange = toggleAll;
  document.getElementById('downloadButton').onclick = downloadCheckedLinks;
  chrome.windows.getCurrent(function (currentWindow) {
    chrome.tabs.query({active: true, windowId: currentWindow.id},
                      function(activeTabs) {
    chrome.tabs.executeScript(
        activeTabs[0].id, {file: '/background/send_links.js', allFrames: true});
    });
  });
};

// Listen to messages from the send_links.js script and write to popout.html
allLinks = [];
chrome.extension.onRequest.addListener(function(links) {
  for (var index in links) {
    allLinks.push(links[index]);
  }
  allLinks.sort();
  visibleLinks = filterLinks();
  showLinks();
});


// Toggle the checked state of all visible links.
function toggleAll() {
  var checked = document.getElementById('toggleAllCheckBox').checked;
  for (var i = 0; i < visibleLinks.length; ++i) {
    document.getElementById('check' + i).checked = checked;
  }
}

// Select only the pdf and doc files and return the links
function filterLinks() {
  console.log(allLinks[0]);
  for (var i =0; i < allLinks.length ; i++) {
    if ((allLinks[i].substr(allLinks[i].length - 4) == '.pdf') ||
        (allLinks[i].substr(allLinks[i].length - 4) == '.doc') ||
        (allLinks[i].substr(allLinks[i].length - 5) == '.docx')) {
          visibleLinks.push(allLinks[i]);
    }
  }
  return visibleLinks;
}

// Display all visible links in the popup
function showLinks() {
  var linksTable = document.getElementById('links');
  while (linksTable.children.length > 1) {
    linksTable.removeChild(linksTable.children[linksTable.children.length - 1])
  }
  for (var i = 0; i < visibleLinks.length; ++i) {
    var row = document.createElement('tr');
    var col0 = document.createElement('td');
    var col1 = document.createElement('td');
    var checkbox = document.createElement('input');
    checkbox.checked = true;
    checkbox.type = 'checkbox';
    checkbox.id = 'check' + i;
    col0.appendChild(checkbox);
    linksTextArray = visibleLinks[i].split("/");
    col1.innerText = linksTextArray[linksTextArray.length - 1];
    col1.style.whiteSpace = 'nowrap';
    col1.onclick = function() {
      checkbox.checked = !checkbox.checked;
    }
    row.appendChild(col0);
    row.appendChild(col1);
    linksTable.appendChild(row);
  }
}

// Download all visible checked links.
function downloadCheckedLinks() {
  var pending = 0;
  for (var i = 0; i < visibleLinks.length; ++i) {
    if (document.getElementById('check' + i).checked) {
      pending = pending + 1;
      chrome.downloads.download({url: visibleLinks[i]}, function(downloadId) {
        pending = pending - 1;
        if (pending <1) {
          window.close()
        }
      });
    }
  }
}
