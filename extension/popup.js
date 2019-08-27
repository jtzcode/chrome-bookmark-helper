let createNoteBtn = document.getElementById('createNote');

/* chrome.storage.sync.get('color', function(data) {
    changeColor.style.backgroundColor = data.color;
    changeColor.setAttribute('value', data.color);
}); */
//let noteStore;
let targetNoteBook, targetNote;
let listAllNotes = function() {
    if(globalNoteStore) {
        globalNoteStore.listNotebooks().then(function(notebooks) {
            // notebooks is the list of Notebook objects
            var noteBooks = notebooks.filter(book => book.name === '资料');
            targetNoteBook = noteBooks[0].guid;
            targetNoteFilter.title === 'Favorite Sites';
            globalNoteStore.findNotesMetadata(targetNoteFilter, 0, 100, targetNoteResultSpec).then((result) => {
                if(result && result.notes) {
                    targetNote = result.notes[0].guid;
                }
                createOrUpdateBookmarkNote('Favorite Sites');
            });
          }, (e) => {
              console.log(e);
        });
    }
};
let createOrUpdateBookmarkNote = function(name) {
    if (globalNoteStore) {
        console.log("Start to create a new note with store.");
        createOrUpdateNote(globalNoteStore, name, '@@Citrix: https://www.citrix.com', targetNoteBook, targetNote, (note) => {
            console.log('Note updated: ' + note.title);
        });
    }
}

createNoteBtn.addEventListener('click', (event) => {
    listAllNotes();
});

