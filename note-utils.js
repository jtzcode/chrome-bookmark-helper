var Evernote = require('evernote');
var developerToken = "developer_token";
// Developer token can be applied here: https://app.yinxiang.com/api/DeveloperToken.action
// Developer guide of JavaScript: https://github.com/yinxiang-dev/evernote-sdk-js
 
//var client = new Evernote.Client({token: developerToken});

var client = new Evernote.Client({
    token: developerToken,
    sandbox: false,
    china: true,
  });
 
// Set up the NoteStore client 
globalNoteStore = client.getNoteStore();
targetNoteFilter = new Evernote.NoteStore.NoteFilter();
targetNoteResultSpec = new Evernote.NoteStore.NotesMetadataResultSpec();

createOrUpdateNote = function (noteStore, noteTitle, noteBody, parentNotebook, targetNote, callback) {
 
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
}
