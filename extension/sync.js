/*
    Initialize Storage
*/
let Evernote = require('evernote');
// Developer token can be applied here: https://app.yinxiang.com/api/DeveloperToken.action
// Developer guide of JavaScript: https://github.com/yinxiang-dev/evernote-sdk-js

let authenticated = false;
let developer_token = '';
let storageType = 'everenote';
let nBody = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>";
nBody += "<!DOCTYPE en-note SYSTEM \"http://xml.evernote.com/pub/enml2.dtd\">";
let noteNodeName = "en-note";
let targetFolderName = "Evernote Sync"

let initStorage = () => {
    console.log("Storage init starts.");
    return new Promise((resolve, reject) => { 
        chrome.storage.local.get([
            'noteType'
        ], (items) => {
            storageType = items['noteType'];
            if (storageType === 'evernote') {
                chrome.storage.local.get([
                    'access_token'
                ], (results) => {
                        try {
                            console.log("Token: " + results['access_token']);
                            evernoteClient = new Evernote.Client({
                                token: results['access_token'],
                                sandbox: true,
                                china: true,
                                serviceHost: "sandbox.yinxiang.com"
                            });
                            if (results.access_token) {
                                authenticated = true;
                                setAuthData(authenticated, results['access_token']);
                                resolve({ state: 'success' });
                            }
                        } catch (e) {
                            authenticated = false;
                            setAuthData(authenticated, undefined);
                            reject("Auth failed.");
                            console.log(e);
                        }
                });
            } else {
                reject('Storage type not supported.');
            }
        });
    });
};

let setAuthData = (status, token) => {
    chrome.storage.local.set({
        'authenticated': status,
        'access_token': token
      }, () => {
          console.log("Authentication status set to: " + status);
    });
};

initStorage().then((result) => {
    /*
        a. Synchronized bookmarks from storage
        b. Upload new bookmarks to storage
    */
    if (authenticated) {
        prepare();
        syncBookmarks();
    }
});

let syncBookmarks = () => {
    console.log("Bookmark sync starts.");
    //startSyncBookmarks('Test', 'My Sites', 'Globalization');
};
 
let prepare = () => {
    console.log("Prepare storage utilites.")
    globalNoteStore = evernoteClient.getNoteStore();
    targetNoteFilter = new Evernote.NoteStore.NoteFilter();
    targetNoteResultSpec = new Evernote.NoteStore.NotesMetadataResultSpec();
    XMLParser = require('xml2js').parseString;
};

let createOrUpdateNote = function (noteStore, noteTitle, noteBody, parentNotebook, targetNote, callback) {
    // Create note object
    var ourNote = new Evernote.Types.Note();
    ourNote.title = noteTitle;
    ourNote.content = noteBody;
    
    // parentNotebook is optional; if omitted, default notebook is used
    if (parentNotebook) {
        ourNote.notebookGuid = parentNotebook;
    }

    if (targetNote) {
        ourNote.guid = targetNote;
        noteStore.updateNote(ourNote)
        .then(function(note) {
            callback(note);
        }).catch(function (err) {
            // Something was wrong with the note data
            // See EDAMErrorCode enumeration for error code explanation
            // http://dev.evernote.com/documentation/reference/Errors.html#Enum_EDAMErrorCode
            console.log(err);
        });
    }
    else {
        // Attempt to create note in Evernote account (returns a Promise)
        noteStore.createNote(ourNote)
            .then(function(note) {
            callback(note);
            }).catch(function (err) {
            // Something was wrong with the note data
            // See EDAMErrorCode enumeration for error code explanation
            // http://dev.evernote.com/documentation/reference/Errors.html#Enum_EDAMErrorCode
            console.log(err);
        });
    }
};

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

let findNotes = (bookName, noteName) => {
    return new Promise((resolve, reject) => { 
        if(globalNoteStore) {
            globalNoteStore.listNotebooks().then(function(notebooks) {
                // notebooks is the list of Notebook objects
                var noteBooks = notebooks.filter(book => book.name === bookName);
                targetNoteBook = noteBooks[0].guid;
                targetNoteFilter.title === noteName;
                globalNoteStore.findNotesMetadata(targetNoteFilter, 0, 100, targetNoteResultSpec).then((result) => {
                    if(result && result.notes) {
                        targetNote = result.notes[0].guid;
                        resolve({ state: 'success' });
                    }
                });
            }, (e) => {
                console.log(e);
                reject('Error when listing notebooks.')
            });
        } else {
            reject('Note store is not defined.');
        }
    });
};

let startSyncBookmarks = (book, title, filter) => {
    findNotes(book, title).then((result) => {
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
    });
};
