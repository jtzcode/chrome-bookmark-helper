/* chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.sync.set({noteStore: 'globalStore'}, function() {
      console.log("Note store created.");
    });
  }); */

/* chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([{
        conditions: [new chrome.declarativeContent.PageStateMatcher({
                pageUrl: {hostEquals: 'developer.chrome.com'},
            })
        ],
        actions: [new chrome.declarativeContent.ShowPageAction()]
    }]);
    console.log("Add rules.")
}); */
let globalNoteStore;
let evernoteClient;
let createNote;
let targetNoteFilter;
let targetNoteResultSpec;
let XMLParser;

console.log("Background loaded.");
