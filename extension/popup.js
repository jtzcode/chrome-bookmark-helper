let createNoteBtn = document.getElementById('createNote');

/* chrome.storage.sync.get('color', function(data) {
    changeColor.style.backgroundColor = data.color;
    changeColor.setAttribute('value', data.color);
}); */
//let noteStore;
let targetNoteBook, targetNote;

let nBody = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>";
nBody += "<!DOCTYPE en-note SYSTEM \"http://xml.evernote.com/pub/enml2.dtd\">";
let noteNodeName = "en-note";
let targetFolderName = "Evernote Sync"


let refreshBookmarks = function() {
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
                globalNoteStore.getNote(targetNote, true, false, false, false).then((note) => {
                    //Needs to parse with XML parser and then JSON parser.
                    XMLParser(note.content, (err, result) => {
                        let content = JSON.parse(result[noteNodeName]);
                        //create/update a bookmark
                        chrome.bookmarks.search(targetFolderName, (bookmarks) => {
                            let targetFolder = bookmarks[0];
                            if (targetFolder) {
                                for(let name in content) {
                                    chrome.bookmarks.create({
                                        "parentId": targetFolder.id,
                                        "title": name,
                                        "url": decodeURIComponent(content[name])
                                    });
                                }
                            }
                        });
                    });
                });
                
            });
          }, (e) => {
              console.log(e);
        });
    }
};

let uploadBookmarks = function() {
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

let syncBookmark = function(title, filter) {
    let notes = "{";
    chrome.bookmarks.search(filter, (bookmarks) => {
        bookmarks.forEach(bookmark => {
            notes += ('"' + bookmark.title + '": "' + encodeURIComponent(bookmark.url) + '",');
        });
        notes = notes.slice(0, -1);
        notes += "}";
        nBody += "<en-note>" + notes + "</en-note>";
        createOrUpdateNote(globalNoteStore, title, nBody, targetNoteBook, targetNote, (note) => {
            console.log('Note updated: ' + note.title);
        });
    });
};

let createOrUpdateBookmarkNote = function(title) {
    if (globalNoteStore) {
        console.log("Start to create/update a note with store.");
        syncBookmark(title, "Globalization");
    }
}

createNoteBtn.addEventListener('click', (event) => {
    //uploadBookmarks();
    refreshBookmarks();
});

