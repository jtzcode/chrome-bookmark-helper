/* // Saves options to chrome.storage
function save_options() {
    chrome.storage.sync.set({
      favoriteColor: "color",
      likesColor: "likesColor"
    }, function() {
      // Update status to let user know options were saved.
      var status = document.getElementById('status');
      status.textContent = 'Options saved.';
      setTimeout(function() {
        status.textContent = '';
      }, 750);
    });
  }
  
  // Restores select box and checkbox state using the preferences
  // stored in chrome.storage.
  document.addEventListener('DOMContentLoaded', restore_options);
  document.getElementById('save').addEventListener('click',
      save_options); */

let evernoteStore;

let restore_options = () => {
    chrome.storage.sync.get({
        storage_type: 'evernote'
    }, (items) => {
        let type = items.storage_type;
        // Currently, only Evernote is supported.
        if (type === 'evernote') {
            // Check if evernote account is authenticated with token.
            // If authenticated, load the notebooks.
            chrome.storage.sync.get({
                targetBook: '',
                targetNote: ''
              }, (results) => {
                targetBook = results.targetBook;
                targetNote = results.targetNote;
            });
        }
        // else load options of other storage types
    });
};

$(() => {

});