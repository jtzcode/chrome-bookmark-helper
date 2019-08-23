var Evernote = require('evernote');
var developerToken = "developer-token";
 
//var client = new Evernote.Client({token: developerToken});

var client = new Evernote.Client({
    token: developerToken,
    sandbox: false,
    china: true,
  });
 
// Set up the NoteStore client 
var noteStore = client.getNoteStore();
 
noteStore.listNotebooks().then(function(notebooks) {
    // notebooks is the list of Notebook objects
    notebooks.forEach(book => {
        console.log(book.name);
    });
  }, (e) => {
      console.log(e);
  });